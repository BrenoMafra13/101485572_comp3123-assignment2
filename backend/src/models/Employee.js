import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    address: { type: String, required: true },
    salary: { type: Number, required: true },
    department: { type: String, required: true },
    position: { type: String, required: true },
    picture: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("Employee", employeeSchema);
