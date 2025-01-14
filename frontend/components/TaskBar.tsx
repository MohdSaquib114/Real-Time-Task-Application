"use client"

import { useEffect, useState } from "react"

type Task = {
  id: string,
  description: string,
  status: string,
  created_at: Date,
  updated_at: Date
}

export default function TaskBar() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskDescription, setNewTaskDescription] = useState("")

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch("http://localhost:8080/api/task");
      const data = await response.json();
      if (data.success) {
      
        setTasks(data.tasks.reverse());
      }

    }
    fetchTasks()

    const ws: WebSocket = new WebSocket("ws://localhost:8080")
    ws.onopen = () => {
      console.log("Socket connection established")
    }
    ws.onmessage = (e) => {
      const message = JSON.parse(e.data)
      
      if (message.action === "ADD") {
          console.log("ADD")
          setTasks((prevTasks) =>{ 
            const updateTask = [message.task,...prevTasks]
        console.log("Update task", updateTask)
    return updateTask});
        } else if (message.action === "UPDATE") {
          console.log("Ipdate")
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === message.task.id ? message.task : task
        )
    );
} else if (message.action === "DELETE") {
          console.log("Del")
        setTasks((prevTasks) =>{

          const newTasks = prevTasks.filter((task) => task.id !== message.task.id)
        console.log(newTasks)
        return newTasks
        }
      
          
        );
      }
    
    }

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, [])

  const addTask = async () => {
    if (newTaskDescription.trim() === "") return;
    
    const response = await fetch("http://localhost:8080/api/task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description: newTaskDescription }),
    });

    const data = await response.json();
    if (data.success) {
      setNewTaskDescription("");
    }
  }

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    const task = tasks.find(val=>val.id === taskId)
    const response = await fetch(`http://localhost:8080/api/task/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({description:task?.description, status: newStatus }),
    });

    const data = await response.json();
    if (!data.success) {
      console.error("Failed to update task status");
    }
  }

  const deleteTask = async (taskId: string) => {
    const response = await fetch(`http://localhost:8080/api/task/${taskId}`, {
      method: "DELETE",
    });

    const data = await response.json();
    if (!data.success) {
      console.error("Failed to delete task");
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task Manager</h1>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Enter new task"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          className="flex-grow mr-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addTask}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Task
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks?.map((task: Task) => (
          <div key={task.id} className="border border-gray-200 rounded-md p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold truncate">{task.description}</h2>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                task.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
              }`}>
                {task.status}
              </span>
            </div>
            <div className="text-sm text-gray-500 mb-2">
              <p>Created: {new Date(task.created_at).toLocaleString()}</p>
              <p>Updated: {new Date(task.updated_at).toLocaleString()}</p>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => updateTaskStatus(task.id, task.status === "COMPLETED" ? "PENDING" : "COMPLETED")}
                className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Toggle Status
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

