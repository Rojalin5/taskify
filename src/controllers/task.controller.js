import Task from '../models/Task.js';
import { io } from "../../server.js";
import { calculatePriority } from '../utils/priority.js';

export const createTask = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      user: req.user.id,
      priorityScore: calculatePriority(req.body)
    });

    io.emit("taskCreated", task);

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });

    const updatedTasks = tasks.map((task) => {
      const obj = task.toObject();
      obj.priorityScore = calculatePriority(task);
      return obj;
    });

    updatedTasks.sort((a, b) => {
      if (b.priorityScore === a.priorityScore) {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      return b.priorityScore - a.priorityScore;
    });

    res.json(updatedTasks);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    let task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    Object.assign(task, req.body);

    task.priorityScore = calculatePriority(task);

    await task.save();

    io.emit("taskUpdated", task);

    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    // 🔥 ADD THIS (real-time update)
    io.emit("taskDeleted");

    res.json({ msg: "Task deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};