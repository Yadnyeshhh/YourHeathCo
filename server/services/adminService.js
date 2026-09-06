const Admin = require("../models/adminModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const MedsService = require("./medsService");

const createToken = (_id) => {
  return jwt.sign({ _id, id: _id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

class AdminService {
  async signup(data) {
    const { email } = data;
    const exists = await Admin.findOne({ email });
    if (exists) {
      throw new AppError("Email already exists", 400);
    }
    const admin = await Admin.create(data);
    const token = createToken(admin._id);
    return { admin: { _id: admin._id, email: admin.email, name: admin.name }, token };
  }

  async login(email, password) {
    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin || !(await admin.comparePassword(password))) {
      throw new AppError("Incorrect email or password", 401);
    }
    const token = createToken(admin._id);
    return { admin: { _id: admin._id, email: admin.email, name: admin.name }, token };
  }

  async getAllAssignedUsers(adminId, query) {
    let filter = {};
    if (adminId) {
      filter.admin = adminId;
    }
    if (query) {
      const orConditions = [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { contact: { $regex: query, $options: "i" } }
      ];
      filter.$or = orConditions;
    }
    const users = await User.find(filter).select("-password -__v");
    return users;
  }

  async getAdminProfile(adminId) {
    const admin = await Admin.findById(adminId).select("-password -__v");
    if (!admin) {
      throw new AppError("Admin not found", 404);
    }
    return admin;
  }

  // Reset patient schedule to empty meds/meals
  async resetPatientSchedule(patientId) {
    return await MedsService.resetSchedule(patientId);
  }
}

module.exports = new AdminService();
