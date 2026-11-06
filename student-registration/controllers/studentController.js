const mongoose = require("mongoose");
const Student = require("../models/Student");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FIELDS = ["name", "email", "department", "course"];

// Validates request body. For POST all fields are required; for PUT they are
// required too (full update), but unknown fields are always ignored.
const validateBody = (body) => {
  const errors = [];
  for (const field of FIELDS) {
    const value = body[field];
    if (value === undefined || value === null || typeof value !== "string" || value.trim() === "") {
      errors.push(`${field} is required and must be a non-empty string`);
    }
  }
  if (typeof body.name === "string" && body.name.trim().length > 0 && body.name.trim().length < 2) {
    errors.push("name must be at least 2 characters");
  }
  if (typeof body.email === "string" && body.email.trim() !== "" && !EMAIL_REGEX.test(body.email.trim())) {
    errors.push("email must be a valid email address");
  }
  return errors;
};

const pickFields = (body) => {
  const data = {};
  for (const field of FIELDS) {
    if (typeof body[field] === "string") data[field] = body[field].trim();
  }
  return data;
};

const handleError = (err, res) => {
  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: "A student with this email already exists" });
  }
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }
  console.error(err);
  return res.status(500).json({ success: false, message: "Internal server error" });
};

const checkId = (id, res) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ success: false, message: "Invalid student ID" });
    return false;
  }
  return true;
};

// POST /api/students
exports.createStudent = async (req, res) => {
  const errors = validateBody(req.body || {});
  if (errors.length) {
    return res.status(400).json({ success: false, message: "Validation failed", errors });
  }
  try {
    const student = await Student.create(pickFields(req.body));
    return res.status(201).json({ success: true, message: "Student added successfully", data: student });
  } catch (err) {
    return handleError(err, res);
  }
};

// GET /api/students  and  GET /api/students?department=IT
exports.getStudents = async (req, res) => {
  try {
    const filter = {};
    if (req.query.department) {
      // case-insensitive exact match, regex special chars escaped
      const escaped = String(req.query.department).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.department = new RegExp(`^${escaped}$`, "i");
    }
    const students = await Student.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: students.length, data: students });
  } catch (err) {
    return handleError(err, res);
  }
};

// GET /api/students/:id
exports.getStudentById = async (req, res) => {
  if (!checkId(req.params.id, res)) return;
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });
    return res.status(200).json({ success: true, data: student });
  } catch (err) {
    return handleError(err, res);
  }
};

// PUT /api/students/:id
exports.updateStudent = async (req, res) => {
  if (!checkId(req.params.id, res)) return;
  const errors = validateBody(req.body || {});
  if (errors.length) {
    return res.status(400).json({ success: false, message: "Validation failed", errors });
  }
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, pickFields(req.body), {
      new: true,
      runValidators: true,
    });
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });
    return res.status(200).json({ success: true, message: "Student updated successfully", data: student });
  } catch (err) {
    return handleError(err, res);
  }
};

// DELETE /api/students/:id
exports.deleteStudent = async (req, res) => {
  if (!checkId(req.params.id, res)) return;
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });
    return res.status(200).json({ success: true, message: "Student deleted successfully" });
  } catch (err) {
    return handleError(err, res);
  }
};
