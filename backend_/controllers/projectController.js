import asyncHandler from "express-async-handler"
import Project from "../models/projectModel.js"

const AddProject = asyncHandler(async(req,res)=>{
    if (!req.file) {
    return res.status(400).json({ message: "file is specified !!" });
    }

    const {projectTitle,description,department,passoutYear} = req.body

    if (!projectTitle) {
        return res.status(400).json({ message: "title is specified !!" });
    }
    if (!description) {
        return res.status(400).json({ message: "description is specified !!" });
    }

    if (!department) {
        return res.status(400).json({ message: "department is specified !!" });
    }

    if (!passoutYear) {
        return res.status(400).json({ message: "passoutYear is specified !!" });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    var newProject = await Project.create({
        title:projectTitle,
        description,
        department,
        passout_year:passoutYear,
        file:fileUrl
    })

    if (!newProject) {
        res.status(400).json({ message: "some error occured !!" });

    }

    res.status(201).json({ message: "Project uploaded successfully!", project: newProject });

})

const getProject = asyncHandler(async (req,res)=>{
    const projects = await Project.find()
    res.status(200).json(projects)
})

export {AddProject,getProject}