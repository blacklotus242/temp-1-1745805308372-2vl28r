import { useState } from 'react';
import { saveTask } from '../services/db';

export default function ScanTask() {
  const [capturedText, setCapturedText] = useState('');

  const handleCaptureText = (e) => {
    e.preventDefault();
    if (!capturedText.trim()) return;

    const newTask = { userId: 'current-user', name: capturedText, createdAt: new Date().toISOString() };
    saveTask(newTask);
    alert('Task created from scanned text!');
    setCapturedText('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Scan Text for Task</h1>
      <form onSubmit={handleCaptureText} className="flex flex-col gap-4">
        <textarea
          placeholder="Paste or type scanned text here..."
          value={capturedText}
          onChange={(e) => setCapturedText(e.target.value)}
          className="border p-2 rounded min-h-[100px] w-full max-w-md"
        />
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">
          Create Task
        </button>
      </form>
    </div>
  );
}