const medsService = require("../services/medsService");
const catchAsync = require("../utils/catchAsync");
const ApiResponse = require("../utils/apiResponse");

const updateMeds = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { schedule } = req.body;

  const updated = await medsService.updateMeds(id, schedule);
  res.status(200).json(new ApiResponse(200, updated, "Medications and meals updated successfully"));
});

const createEmptyPatientSchedule = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await medsService.createEmptyPatientSchedule(id);

  if (!result.isNew) {
    return res.status(200).json(new ApiResponse(200, result.patient, "Patient schedule already exists"));
  }

  res.status(201).json(new ApiResponse(201, result.patient, "Patient schedule created"));
});

// Used internally usually but exported if needed by routes
const getAllMedsAndMeals = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await medsService.getAllMedsAndMeals(id);

  if (!result) {
    return res.status(404).json(new ApiResponse(404, null, "Patient schedule not found"));
  }

  res.status(200).json(new ApiResponse(200, result, "Patient schedule fetched"));
});

module.exports = { updateMeds, getAllMedsAndMeals, createEmptyPatientSchedule };
