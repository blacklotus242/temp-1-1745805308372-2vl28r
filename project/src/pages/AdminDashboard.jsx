import { useAuth } from '../contexts/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return <div className="p-4">Access Denied</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Admin Dashboard</h1>
      <p>Welcome, Admin {user.email}!</p>
    </div>
  );
}