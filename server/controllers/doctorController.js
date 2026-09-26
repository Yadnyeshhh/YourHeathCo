const Doctor = require('../models/Doctor');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/apiResponse');
const AppError = require('../utils/appError');

const createDoctor = catchAsync(async (req, res) => {
  const doctor = await Doctor.create(req.body);
  res.status(201).json(new ApiResponse(201, doctor, 'Doctor created successfully'));
});

const getAllDoctors = catchAsync(async (req, res) => {
  const { patientId } = req.query;
  let filter = {};
  if (patientId) {
    filter = {
      $or: [
        { patientId: patientId },
        { patientId: null },
        { patientId: { $exists: false } }
      ]
    };
  }
  const doctors = await Doctor.find(filter).lean();
  res.status(200).json(new ApiResponse(200, doctors, 'Doctors fetched successfully'));
});

const getDoctorById = catchAsync(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id).lean();
  if (!doctor) throw new AppError('Doctor not found', 404);
  res.status(200).json(new ApiResponse(200, doctor, 'Doctor fetched successfully'));
});

const updateDoctor = catchAsync(async (req, res) => {
  const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!doctor) throw new AppError('Doctor not found', 404);
  res.status(200).json(new ApiResponse(200, doctor, 'Doctor updated successfully'));
});

const deleteDoctor = catchAsync(async (req, res) => {
  const doctor = await Doctor.findByIdAndDelete(req.params.id);
  if (!doctor) throw new AppError('Doctor not found', 404);
  res.status(200).json(new ApiResponse(200, null, 'Doctor deleted successfully'));
});

module.exports = { createDoctor, getAllDoctors, getDoctorById, updateDoctor, deleteDoctor };
