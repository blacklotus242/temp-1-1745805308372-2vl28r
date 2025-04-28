import { useState } from 'react';

export default function Profile() {
  const [preferences, setPreferences] = useState({ theme: 'light', displayName: '' });

  const handleSave = () => {
    alert('Preferences saved! (This is a placeholder. API integration needed.)');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Profile Settings</h1>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Display Name"
          value={preferences.displayName}
          onChange={(e) => setPreferences({ ...preferences, displayName: e.target.value })}
          className="border p-2 rounded"
        />
        <select
          value={preferences.theme}
          onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="light">Light Theme</option>
          <option value="dark">Dark Theme</option>
        </select>
        <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
          Save Preferences
        </button>
      </div>
    </div>
  );
}