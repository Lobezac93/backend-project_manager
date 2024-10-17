import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.ObjectId,
        ref: 'Task', // Reference to the Project model
        required: true
    },
    title: {
        type: String, // Fix missing 'type'
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

const Task = mongoose.model('Task', taskSchema); // No need for 'new' with mongoose.model
export { taskSchema }; // Exporting taskSchema for use in other models
export default Task;
