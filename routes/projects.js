import { Router } from "express";
import Project from "../models/Projects.js";
import Task from "../models/Task.js";

const router = new Router();

//**GET/api/projects:  request fetches all projects*/
router.get("/", async (req, res, next) => {
  try {
    const projects = await Project.find();
    if (projects.length) {
      res.json({ projects });
    } else {
      res.json({ message: "No projects found" });
    }
  } catch (error) {
    next(error);
  }
});

//**POST /api/projects : create a new project document */
router.post("/", async (req, res, next) => {
  try {
    const { body } = req;
    const newProject = await Project.create(body);
    if (newProject) {
      res.status(201).json({ project: newProject });
    } else {
      res.status(400).json({ message: "Error creating new project" });
    }
  } catch (error) {
    next(error);
  }
});

//**GET project by id */
router.get("/:id", async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project) {
      res.json({ project });
    } else {
      res
        .status(404)
        .json({ message: `No project found with id ${req.params.id}` });
    }
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/projects/:id
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (deletedProject) {
      res.json({
        message: `Project deleted: ${req.params.id}`,
        deletedProject,
      });
    } else {
      res
        .status(404)
        .json({ message: `Error deleting project: ${req.params.id}` });
    }
  } catch (error) {
    next(error);
  }
});

//** PUT api/projects/:id : updates a document by Id */
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const updatedProject = await Project.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (updatedProject) {
      res.json(updatedProject);
    } else {
      res.status(404).json({ message: `No project found with id ${id}` });
    }
  } catch (error) {
    next(error);
  }
});

//**POST /api/projects/:id/task: creates a new task for a specific project */
/**
 * POST /api/projects/:id/tasks
 * @description create a new task for a specific project
 */
router.post("/:id/tasks", async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404).json({ message: `Project not found: ${req.params.id}` });
      return;
    }

    // create a new task
    const task = new Task(req.body);

    // check if task was successfully created
    await task.validate(); // Ensure task data is valid before saving

    // add the task to the tasks array of the project
    project.tasks.push(task);

    // save both task and project
    await task.save();
    await project.save();

    res.status(201).json({ project });
  } catch (error) {
    next(error);
  }
});

export default router;
