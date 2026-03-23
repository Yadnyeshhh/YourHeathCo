import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import * as parser from '@babel/parser';
import _traverse from '@babel/traverse';
const traverse = _traverse?.default || _traverse;
import _generate from '@babel/generator';
const generate = _generate?.default || _generate;
import postcss from 'postcss';
import * as t from '@babel/types';

const srcDir = path.resolve('./src');

// Find components (only in components/ and pages/)
const jsxFiles = globSync('src/{components,pages}/**/*.jsx').map(p => path.resolve(p));
const mainAndApp = globSync('src/{App,main}.jsx').map(p => path.resolve(p));
const allJsxFiles = [...jsxFiles, ...mainAndApp];

// Find CSS files
const cssFiles = globSync('src/**/*.css').map(p => path.resolve(p));

// State
const componentData = new Map(); // absPath -> { newPath, ast, classesUsed: Set, inlineStyles: [] }
const cssData = new Map(); // absPath -> { ast }
const classUsage = new Map(); // className -> Set<absPath of jsx>

// 1. Parse all JSX and gather class usages, convert inline styles
console.log('Parsing JSX...');
for (const file of allJsxFiles) {
  const code = fs.readFileSync(file, 'utf8');
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx']
  });
  
  const classesUsed = new Set();
  const inlineStylesCSS = [];
  
  const isTarget = jsxFiles.includes(file);
  const ext = path.extname(file);
  const baseName = path.basename(file, ext);
  const dirName = path.dirname(file);
  // If already in a folder with its own name, don't nest it again (e.g. Nav/Nav.jsx)
  let newPath = file;
  let newCssPath = null;
  if (isTarget) {
    if (path.basename(dirName) !== baseName) {
      newPath = path.join(dirName, baseName, baseName + ext);
      newCssPath = path.join(dirName, baseName, baseName + '.css');
    } else {
      newCssPath = path.join(dirName, baseName + '.css');
    }
  }

  traverse(ast, {
    JSXAttribute(pathObj) {
      if (pathObj.node.name.name === 'className') {
        const val = pathObj.node.value;
        if (t.isStringLiteral(val)) {
          val.value.split(/\s+/).filter(Boolean).forEach(c => {
            classesUsed.add(c);
            if (!classUsage.has(c)) classUsage.set(c, new Set());
            classUsage.get(c).add(file);
          });
        }
      }
      
      // Inline styles
      if (isTarget && pathObj.node.name.name === 'style' && t.isJSXExpressionContainer(pathObj.node.value) && t.isObjectExpression(pathObj.node.value.expression)) {
        const props = pathObj.node.value.expression.properties;
        let cssRules = [];
        let canConvert = true;
        for (const prop of props) {
          if (!t.isObjectProperty(prop) || (!t.isIdentifier(prop.key) && !t.isStringLiteral(prop.key)) || (!t.isStringLiteral(prop.value) && !t.isNumericLiteral(prop.value))) {
             canConvert = false;
             break;
          }
          const key = prop.key.name || prop.key.value;
          const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
          const val = prop.value.value;
          cssRules.push(`${cssKey}: ${val}${typeof val === 'number' ? 'px' : ''};`);
        }
        
        if (canConvert && cssRules.length > 0) {
          const newClassName = `${baseName.toLowerCase()}-inline-${inlineStylesCSS.length + 1}`;
          inlineStylesCSS.push(`.${newClassName} {\n  ${cssRules.join('\n  ')}\n}`);
          
          // Add to classesUsed
          classesUsed.add(newClassName);
          if (!classUsage.has(newClassName)) classUsage.set(newClassName, new Set());
          classUsage.get(newClassName).add(file);
          
          // Replace style={{...}} with className="..."
          // Wait, there might ALREADY be a className attribute.
          const parent = pathObj.parentPath.node;
          const existingClassNameAttr = parent.attributes.find(a => a.name && a.name.name === 'className');
          if (existingClassNameAttr) {
             if (t.isStringLiteral(existingClassNameAttr.value)) {
                 existingClassNameAttr.value.value += ` ${newClassName}`;
             }
             pathObj.remove(); // Remove style prop
          } else {
             pathObj.replaceWith(t.jsxAttribute(t.jsxIdentifier('className'), t.stringLiteral(newClassName)));
          }
        }
      }
    }
  });
  
  // Also add CSS import to AST if isTarget and we'll create a CSS file
  if (isTarget && newCssPath) {
    const cssImportStr = `./${baseName}.css`;
    let hasCssImport = false;
    traverse(ast, {
      ImportDeclaration(pathObj) {
        if (pathObj.node.source.value === cssImportStr) {
          hasCssImport = true;
        }
      }
    });
    if (!hasCssImport) {
      ast.program.body.unshift(t.importDeclaration([], t.stringLiteral(cssImportStr)));
    }
  }

  componentData.set(file, { code, ast, classesUsed, inlineStylesCSS, newPath, newCssPath, isTarget, ext, baseName, dirName });
}

// 2. Parse CSS Files
console.log('Parsing CSS...');
for (const file of cssFiles) {
  const cssCode = fs.readFileSync(file, 'utf8');
  const cssAst = postcss.parse(cssCode, { from: file });
  cssData.set(file, { ast: cssAst, code: cssCode });
}

// 3. Extract CSS Rules
console.log('Extracting CSS Rules...');
function extractClassesFromSelector(selector) {
   const classRegex = /\.([a-zA-Z0-9_-]+)/g;
   const classes = [];
   let match;
   while ((match = classRegex.exec(selector)) !== null) {
      classes.push(match[1]);
   }
   return classes;
}

const extractedCssForComponent = new Map(); // file -> string[]

for (const [file, data] of cssData.entries()) {
  const ast = data.ast;
  ast.walkRules(rule => {
      const classesInRule = extractClassesFromSelector(rule.selector);
      if (classesInRule.length === 0) return; // Keep global HTML tag rules where they are

      // Check which components use ANY of the classes in this rule
      const componentsUsingRule = new Set();
      for (const cls of classesInRule) {
          if (classUsage.has(cls)) {
             classUsage.get(cls).forEach(compFile => componentsUsingRule.add(compFile));
          }
      }
      
      // If used by exactly 1 target component, move it!
      if (componentsUsingRule.size === 1) {
         const compFile = Array.from(componentsUsingRule)[0];
         const compInfo = componentData.get(compFile);
         if (compInfo && compInfo.isTarget) {
            if (!extractedCssForComponent.has(compFile)) extractedCssForComponent.set(compFile, []);
            // Support Media Queries / At Rules nesting
            let ruleText = '';
            if (rule.parent && rule.parent.type === 'atrule') {
                const parent = rule.parent;
                ruleText = `@${parent.name} ${parent.params} {\n  ${rule.toString()}\n}`;
                // Remove the rule from parent
                rule.remove();
                // If parent AtRule is now empty, remove it too
                if (parent.nodes.length === 0) {
                    parent.remove();
                }
            } else {
                ruleText = rule.toString();
                rule.remove();
            }
            extractedCssForComponent.get(compFile).push(ruleText);
         }
      }
  });
}

// 4. Update import paths in all JSX files
console.log('Updating Imports...');
// Map of old file abs path -> new file abs path for all JS/JSX files
const movedFilesMapping = new Map();
for (const [oldPath, { newPath }] of componentData.entries()) {
   movedFilesMapping.set(oldPath, newPath);
}

for (const [file, info] of componentData.entries()) {
  const { ast, newPath } = info;
  const newDir = path.dirname(newPath);
  
  traverse(ast, {
    ImportDeclaration(pathObj) {
       let importPath = pathObj.node.source.value;
       // Skip external
       if (!importPath.startsWith('.')) return;
       // We need to resolve importPath against the old file directory
       const oldDir = path.dirname(file);
       
       let absImportPath;
       try {
           absImportPath = require.resolve(path.resolve(oldDir, importPath), { paths: [oldDir] });
       } catch (e) {
           // Fallback resolution for typical react imports without extensions
           const fullPath = path.resolve(oldDir, importPath);
           if (fs.existsSync(fullPath)) absImportPath = fullPath;
           else if (fs.existsSync(fullPath + '.jsx')) absImportPath = fullPath + '.jsx';
           else if (fs.existsSync(fullPath + '.js')) absImportPath = fullPath + '.js';
           else if (fs.existsSync(fullPath + '.css')) absImportPath = fullPath + '.css';
           else return; // unresolvable
       }
       
       if (movedFilesMapping.has(absImportPath)) {
           // It's a component that moved
           const newImportAbs = movedFilesMapping.get(absImportPath);
           const rel = path.relative(newDir, newImportAbs).replace(/\\/g, '/');
           let finalImport = rel.startsWith('.') ? rel : './' + rel;
           // Remove extension for JS/JSX
           finalImport = finalImport.replace(/\.jsx?$/, '');
           
           pathObj.node.source.value = finalImport;
       } else {
           // It's an asset or CSS file that didn't move (or moved separately)
           // For CSS files, if it's the exact CSS file we moved, wait, we don't move CSS files entirely, we just update rules.
           // However, if the component itself moved deeper (e.g. from `pages/Home.jsx` to `pages/Home/Home.jsx`), the relative path to `styles/index.css` needs to go one level up.
           if (newDir !== oldDir) {
               const rel = path.relative(newDir, absImportPath).replace(/\\/g, '/');
               pathObj.node.source.value = rel.startsWith('.') ? rel : './' + rel;
           }
       }
    }
  });
}

// 5. Write everything to disk
console.log('Writing files to disk...');
for (const [file, info] of componentData.entries()) {
  const { ast, newPath, newCssPath, isTarget, inlineStylesCSS, ext } = info;
  const newCode = generate(ast, {}, info.code).code;
  
  if (isTarget && newPath !== file) {
      if (!fs.existsSync(path.dirname(newPath))) {
          fs.mkdirSync(path.dirname(newPath), { recursive: true });
      }
      fs.writeFileSync(newPath, newCode, 'utf8');
      fs.unlinkSync(file); // remove old file
  } else {
      fs.writeFileSync(newPath, newCode, 'utf8');
  }
  
  // Write CSS
  if (isTarget && newCssPath) {
      let cssContent = '';
      if (extractedCssForComponent.has(file)) {
          cssContent += extractedCssForComponent.get(file).join('\n\n') + '\n\n';
      }
      if (inlineStylesCSS.length > 0) {
          cssContent += inlineStylesCSS.join('\n\n') + '\n\n';
      }
      if (cssContent.trim().length > 0) {
          fs.writeFileSync(newCssPath, cssContent, 'utf8');
      } else {
          // ensure an empty file exists if we added import
          if (!fs.existsSync(newCssPath)) fs.writeFileSync(newCssPath, '', 'utf8');
      }
  }
}

// Overwrite modified global CSS
for (const [file, data] of cssData.entries()) {
    const updatedCSS = data.ast.toString();
    fs.writeFileSync(file, updatedCSS, 'utf8');
}

console.log('Refactoring complete!');
