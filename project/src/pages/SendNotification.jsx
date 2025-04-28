import { sendLocalNotification } from '../services/notifications';

export default function SendNotification() {
  const handleNotify = () => {
    sendLocalNotification('Reminder', 'You have a meeting in 5 minutes!');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Test Notification</h1>
      <button onClick={handleNotify} className="bg-yellow-500 text-white px-4 py-2 rounded">
        Send Notification
      </button>
    </div>
  );
}