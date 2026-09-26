const PatientStatus = require("../models/PatientStatus");
const catchAsync = require("../utils/catchAsync");
const ApiResponse = require("../utils/apiResponse");

// PUT /api/patient-status/:userId
const updatePatientStatus = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const updates = { ...req.body };

  // Sanitize assignedDoctor if empty or invalid
  if (updates.assignedDoctor === "" || updates.assignedDoctor === "null" || updates.assignedDoctor === undefined) {
    updates.assignedDoctor = null;
  }

  // Sanitize consultingDoctors array
  if (Array.isArray(updates.consultingDoctors)) {
    updates.consultingDoctors = updates.consultingDoctors.filter(
      docId => docId && typeof docId === "string" && docId.trim() !== ""
    );
  }

  let status = await PatientStatus.findOne({ patient: userId });

  if (!status) {
    status = new PatientStatus({ patient: userId, ...updates });
  } else {
    Object.assign(status, updates);
  }

  await status.save();

  res.status(200).json(new ApiResponse(200, { status }, "Patient status updated successfully"));
});

module.exports = { updatePatientStatus };