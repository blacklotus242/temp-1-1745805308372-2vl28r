import { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000); // Auto dismiss after 3 seconds
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {notifications.map((note) => (
          <div key={note.id} className={"p-4 rounded shadow " + (note.type === 'error' ? 'bg-red-400' : 'bg-green-400') + " text-white"}>
            {note.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}