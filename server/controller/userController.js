const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); 



const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -__v'); // exclude sensitive fields
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};


const getProfile = async (req, res) => {
  try {
    const userId = req.user._id; // decoded from token by auth middleware
    const user = await User.findById(userId).select('-email -password -__v');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


//login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//signup user
const signupUser = async (req, res) => {
  const { name, age, gender, contact, bloodGroup, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      age,
      gender,
      contact,
      bloodGroup,
      email,
      password: hash,
    });

    const token = createToken(user._id);
    res.status(200).json({ email: user.email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id; 
    const updates = req.body; 

    
    delete updates.password;
    delete updates.email;

    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password -__v');

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Failed to update user", error: error.message });
  }
};

module.exports = { loginUser, signupUser ,getProfile , getAllUsers , updateUser};