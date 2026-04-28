import Task from '../models/Task.js';

// ✅ Create Task
export const createTask = async (req, res) => {
  try {
    const { title, description, category, deadline } = req.body;

    if (!title) {
      return res.status(400).json({ msg: "Title is required" });
    }

    const task = await Task.create({
      title,
      description,
      category,
      deadline,
      user: req.user.id
    });

    res.status(201).json(task);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};



// ✅ Get All Tasks (only logged-in user)
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};



// ✅ Update Task (only owner can update)
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ msg: "Task not found or unauthorized" });
    }

    res.json(task);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};



// ✅ Delete Task (only owner can delete)
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      return res.status(404).json({ msg: "Task not found or unauthorized" });
    }

    res.json({ msg: "Task deleted successfully" });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};