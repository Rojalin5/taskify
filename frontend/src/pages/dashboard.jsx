import { useEffect, useState } from "react";
import API from "../api";
import { io } from "socket.io-client";
import "./dashboard.css";

const socket = io("http://localhost:5001");

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");

  // 🔹 Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔹 Load + Real-time updates
  useEffect(() => {
    fetchTasks();

    socket.on("taskCreated", fetchTasks);
    socket.on("taskUpdated", fetchTasks);
    socket.on("taskDeleted", fetchTasks);

    return () => {
      socket.disconnect();
    };
  }, []);

  // 🔹 Add Task
  const addTask = async () => {
    if (!title || !deadline) {
      alert("Please fill all fields");
      return;
    }

    try {
      await API.post("/tasks", { title, deadline });
      setTitle("");
      setDeadline("");
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  // 🔹 Mark Complete
  const markComplete = async (id) => {
    try {
      await API.put(`/tasks/${id}`, { status: "completed" });
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  // 🔹 Delete Task
  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Task Dashboard</h1>

      {/* 🔹 Stats */}
      <div className="stats">
        <div className="card">Total: {tasks.length}</div>

        <div className="card success">
          Completed: {tasks.filter((t) => t.status === "completed").length}
        </div>

        <div className="card warning">
          Pending: {tasks.filter((t) => t.status !== "completed").length}
        </div>
      </div>

      {/* 🔹 Input */}
      <div className="inputBox">
        <input
          placeholder="Enter task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />

        <button onClick={addTask}>Add</button>
      </div>

      {/* 🔹 Task List */}
      <div className="taskList">
        {tasks.length === 0 ? (
          <p className="empty">No tasks yet</p>
        ) : (
          tasks.map((task) => {
            const isOverdue =
              task.deadline && new Date(task.deadline) < new Date();

            return (
              <div
                className={`taskCard ${isOverdue ? "overdue" : ""}`}
                key={task._id}
              >
                <div>
                  <h3>{task.title}</h3>
                  <p>
                    📅{" "}
                    {task.deadline
                      ? new Date(task.deadline).toLocaleDateString()
                      : "No deadline"}
                  </p>
                </div>

                {/* RIGHT SIDE */}
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                  }}
                >
                  <span
                    className={
                      task.priorityScore > 5
                        ? "badge high"
                        : "badge low"
                    }
                  >
                    Priority: {task.priorityScore}
                  </span>

                  {/* ✅ Complete */}
                  {task.status !== "completed" && (
                    <button onClick={() => markComplete(task._id)}>
                      ✅
                    </button>
                  )}

                  {/* ❌ Delete */}
                  <button
                    onClick={() => deleteTask(task._id)}
                    style={{ background: "red", color: "white" }}
                  >
                    🗑
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}