import mongoose, { Types } from "mongoose";

const projectSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description: {
        type: String,
        required: true,
        unique: true,
      },
      department: {
        type: String,
        required: true,
      },
      passout_year: {
        type: String,
        required: true,
      },
      file: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
})

export default mongoose.model("Project",projectSchema)