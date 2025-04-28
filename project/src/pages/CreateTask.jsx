import { useState } from 'react';
import { saveTask } from '../services/db';

export default function CreateTask() {
  const [taskName, setTaskName] = useState('');

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!taskName.trim()) return;

    const newTask = { userId: 'current-user', name: taskName, createdAt: new Date().toISOString() };
    saveTask(newTask);
    alert('Task created and saved!');
    setTaskName('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Create Task</h1>
      <form onSubmit={handleCreateTask} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter task name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Create Task
        </button>
      </form>
    </div>
  );
}