# 1. App Overview
**MyHealth Co** is a full-stack, comprehensive healthcare management SaaS application connecting patients and medical administrators (hospitals/clinics). The platform features secure dual-role access.
Patients can view their personalized medical dashboards, track daily medication and meal schedules, check assigned doctors, and manage billing. Admins can view complete patient directories, add new patients via advanced search filters, update patient vitals, medications, and admission statuses.

# 2. Pages Breakdown

**Page 1: Landing Page (Public)**
*   **Hero Section:** Fixed glassmorphism top navbar (Logo, Links, "Register" CTA). Large bold headline ("Your Health, Our Priority"), subheadline, and primary "Get Started" button. Includes an infinite scrolling marquee of hospital partner logos.
*   **Services Section:** A 3-column grid of service cards (General Checkups, Pediatrics, Cardiology, etc.) with soft shadows and hover uplift.
*   **About Us Section:** Split layout with a blurred gradient background sphere. Left: text and feature list (Experienced Doctors, 24/7 Care). Right: abstract healthcare illustration.
*   **Doctors Section:** A grid displaying doctor profiles (Avatar, Name, Role, Social Links).
*   **Testimonials Section:** Dual infinite-scrolling marquees (moving in opposite directions) with detailed patient review cards.
*   **Contact Section:** Split layout (Left: Contact Info & Address, Right: Message Form).
*   **Footer:** 3-column dark theme footer (Brand Info, Quick Links, Contact Details).

**Page 2: Auth Flow (Login & Admin Signup)**
*   **Layout:** Split-screen layout. Left side contains a large, aesthetically pleasing medical illustration on a branded background color. Right side contains the centered form container.
*   **User Forms:** Toggle between Sign In and Create Account. Multi-step signup includes creating credentials followed by a "Complete Profile" step (Age, Gender, Blood Group, Contact).
*   **Admin Forms:** Separate gateway for Hospital Admin login and Hospital Registration. Focus colors highlight administrative access.

**Page 3: Patient Dashboard**
*   **Layout System:** Permanent left sidebar and a flexible right content area with a sticky top header.
*   **Sidebar Navigation:** Logo area, cleanly spaced navigation links with subtle icons (Home, Appointments, Billing), and a bottom pin with the user's avatar and profile name.
*   **Top Header:** Page Title ("Dashboard"), Notification Bell icon, and a "Profile" settings button.
*   **Data Highlights (Top Cards):** A row of interactive widget cards for specific health metrics (e.g., "Medicines", "Meals"). Clicking these opens an overlay modal showing detailed data tables.
*   **Quick Updates / Program Section:** A vertical list card showing recent activities or next appointment dates.
*   **Billing Summary Section:** A 3-column financial summary card (Total Billed, Total Paid, Remaining) in distinct color variants (Blue, Green, Red).
*   **Team Today Section:** A minimal card showing the currently assigned doctor and their schedule.

**Page 4: Admin Dashboard (Patient Management)**
*   **Sidebar & Header:** Consistent with Patient Dashboard, tailored for Admin actions.
*   **Main Patient Roster:** A comprehensive dashboard featuring a top filter bar (Dropdown for "All", "Admitted", "Not Admitted").
*   **Patient Grid:** A responsive grid of clean, card-based patient snippets (Name, Age, Blood Group, Status Badge).

**Page 5: Admin Sub-Pages (Add & Details)**
*   **Add Patient View:** Advanced filter bar (Search input, Gender select, Blood Group select, Min/Max Age inputs) above a list of unassigned users. Includes pagination controls at the bottom.
*   **Patient Details View:** A highly detailed, multi-section page per patient. Includes sections for: Admitted Status toggle, Doctor Assignment form (with Date/Time selectors), complex editable Data Tables for Medications (Day, Medicine, Time) and Meals, and a high-contrast "Unassign" action zone at the bottom.

# 3. Components List
*   **Glassmorphic Navbars & Sidebar Menus:** Semi-transparent backgrounds with backdrop blur.
*   **Interactive Cards:** Used for Services, Doctor Profiles, Testimonials, and Dashboard Metrics. Must support hover states (scale up, shadow intensity increase).
*   **Data Tables in Modals:** Clean, borderless table structures inside rounded-corner modals with semi-transparent overlays.
*   **Input Fields & Selectors:** Soft rounded input fields with subtle borders that transition to solid colored borders on focus.
*   **Status Badges:** Small pill-shaped tags (e.g., "Paid/Pending" or "Admitted/Not Admitted") utilizing semantic colors (Green/Red/Amber text on light color-matched backgrounds).
*   **Action Buttons:** Primary solid buttons, secondary outlined buttons, and danger buttons (Unassign) with micro-interactions on click/hover.

# 4. Design Style Guide
*   **Aesthetic Theme:** Modern Healthcare SaaS. Trustworthy, clean, minimal, and premium. Implement a dynamic "Dark Mode" toggle if possible, but default to a highly polished Light/Glassmorphic mode.
*   **Color Palette:**
    *   **Primary:** Trust Blue (e.g., `#2563EB` or `#1D4ED8`) for primary actions and brand highlights.
    *   **Secondary/Accents:** Vibrant Yellow/Amber (e.g., `#FBBF24`) used sparingly for CTAs, and a soft Teal/Cyan for health-related metrics.
    *   **Backgrounds:** Off-white/slate backgrounds (`#F8FAFC` or `#F3F4F6`) for the main canvas, pure white (`#FFFFFF`) for elevated cards.
    *   **Semantic:** Soft Green for "Paid/Admitted", Soft Red/Coral for "Pending/Action Required".
*   **Typography:** Modern sans-serif (e.g., Inter, Plus Jakarta Sans, or Outfit). High contrast between section headers (Bold, dark slate) and supplementary text (Medium, soft gray).
*   **Shapes & Shadows:** Generous border radii (12px to 16px) on all cards and inputs. Smooth, diffused drop shadows (e.g., 0 10px 15px -3px rgba(0, 0, 0, 0.05)) to create depth without harshness.
*   **FX & Animations:** Use Glassmorphism (blur filters) on sticky headers and modals. Micro-animations on button hovers and smooth ease-in-out transitions when tabs/modals are opened.

# 5. Final Framer AI Prompt (READY TO COPY)

> Design a complete, premium, modern SaaS web application for a healthcare management platform called "MyHealth Co". The interface should feel extremely professional, trustworthy, and visually stunning, utilizing a clean, minimal aesthetic with glassmorphism effects, soft diffused shadows, and large rounded corners (12px-16px). The color palette must lean on a 'Trust Blue' primary color, subtle semantic status colors (green/red), and light slate/off-white backgrounds to make pure white cards pop. Use a highly legible modern sans-serif font (like Inter or Plus Jakarta Sans).
> 
> Please generate the following distinct layouts:
> 
> 1. A **Public Landing Page** featuring a glassmorphic sticky top navbar, a bold hero section with a primary CTA and a hospital-logo infinite marquee. Below the hero, include a 3-column grid of 'Services' cards, a split-layout 'About Us' section with abstract background gradients, a 'Doctors' grid profile section, dual-directional infinite marquees for 'Testimonials', and a clean Contact Form paired with a dark-themed, 3-column Footer.
> 
> 2. A **Split-Screen Authentication Flow** where the left half is occupied by a branded medical illustration or gradient, and the right half features a clean, centered form container. The form should include a 'Sign In' variant and a multi-step 'Complete Profile' variant (Name, Age, Dropdowns for Gender/Blood Group) with a prominent submit button.
> 
> 3. A **Patient Dashboard Layout** utilizing a persistent left sidebar (Logo, navigation links with subtle icons, profile avatar pinned to the bottom) and a main content area. The main area must have a top header (Title, Notification Bell), a top row of metric widgets (for Medicines/Meals that look clickable), a vertical 'Quick Updates' list component, and a 3-column 'Billing Summary' component displaying 'Total Billed', 'Paid', and 'Remaining' with distinct semantic styling.
> 
> 4. An **Admin Patient Management Dashboard** using the same sidebar layout, but the main content area should focus on a robust 'Patient Roster'. This includes a top filter bar with dropdowns, search inputs, and age-range inputs. Below the filters, display a responsive layout of 'Patient Cards' showing Name, Age, Blood Group, and semantic Status Badges (e.g., Admitted / Not Admitted) along with an 'Assign/Edit' action button on each card.
> 
> Ensure the overarching design incorporates modern micro-interactions, distinct component hierarchy, and a responsive structure that would adapt beautifully to mobile screens. Do not use generic placeholders; design it to look like a fully functional, high-end commercial product.
