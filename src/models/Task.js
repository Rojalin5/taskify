import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    category: String,
    status: {
  type: String,
  default: "pending"
},
    deadline: Date,
    priorityScore: {
      type: Number,
      default: 0
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);

export default Task;