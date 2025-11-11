import Employee from "../models/Employee.js";

export const createEmployee = async (req, res) => {
  try {
    const data = req.body;
    const picture = req.file ? req.file.filename : null;

    const employee = await Employee.create({
      ...data,
      picture
    });

    return res.status(201).json(employee);
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
};

export const getEmployees = async (req, res) => {
  try {
    const list = await Employee.find().sort({ createdAt: -1 });
    return res.json(list);
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ error: "Not found" });
    return res.json(employee);
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const data = req.body;
    const picture = req.file ? req.file.filename : null;

    const payload = picture ? { ...data, picture } : data;

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true }
    );

    if (!employee) return res.status(404).json({ error: "Not found" });
    return res.json(employee);
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    return res.json({ success: true });
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
};

export const searchEmployees = async (req, res) => {
  try {
    const query = {};

    if (req.query.name)
      query.firstName = { $regex: req.query.name, $options: "i" };

    if (req.query.department)
      query.department = { $regex: req.query.department, $options: "i" };

    if (req.query.position)
      query.position = { $regex: req.query.position, $options: "i" };

    const list = await Employee.find(query);
    return res.json(list);
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
};
