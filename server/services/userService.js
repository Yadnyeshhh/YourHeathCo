const User = require('../models/userModel');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
  return jwt.sign({ _id, id: _id, role: "patient" }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

class UserService {
  async signup(data, adminId = null) {
    const { email } = data;
    const exists = await User.findOne({ email });
    if (exists) {
      throw new AppError("Email already exists", 400);
    }

    const user = await User.create({
      ...data,
      admin: adminId
    });

    const token = createToken(user._id);
    return { user: { _id: user._id, email: user.email, name: user.name }, token };
  }

  async login(email, password) {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError("Incorrect email or password", 401);
    }

    const token = createToken(user._id);
    return { user: { _id: user._id, email: user.email, name: user.name }, token };
  }

  async updateUser(userId, updateData) {
    delete updateData.password; // Prevent updating password here
    delete updateData.email;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select('-password -__v -admin');

    if (!updatedUser) {
      throw new AppError("User not found", 404);
    }
    return updatedUser;
  }

  async uploadProfileImage(userId, filePath) {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImage: filePath.replace(/\\/g, "/") },
      { new: true }
    ).select("-password -__v -admin");

    if (!updatedUser) {
      throw new AppError("User not found", 404);
    }
    return updatedUser;
  }

  async searchUsers(query, filters, pagination) {
    const { gender, bloodGroup, minAge, maxAge } = filters;
    const { page, limit } = pagination;

    const filter = {
      $and: [
        {
          $or: [
            { admin: { $exists: false } },
            { admin: null }
          ]
        },
        { age: { $gte: minAge || 0, $lte: maxAge || 120 } }
      ]
    };

    if (query) {
      filter.$and.push({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
          { contact: { $regex: query, $options: "i" } }
        ]
      });
    }

    if (gender) filter.$and.push({ gender });
    if (bloodGroup) filter.$and.push({ bloodGroup });

    const skip = (page - 1) * limit;

    const users = await User.find(filter)
      .skip(skip)
      .limit(limit)
      .select("-password -__v")
      .lean();

    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / limit);

    return { users, totalPages };
  }
}

module.exports = new UserService();
