import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Tasks from './pages/Tasks';
import { useAuth } from './api/AuthContext';

function Topbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  
  const count: number = "hello";

  if (!isAuthenticated) return null;

  return (
    <div className="topbar">
      <div className="brand">
        task<span>hub</span>
      </div>
      <div className="topbar-user">
        <span>{user?.email}</span>
        <button
          className="btn-ghost"
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

function RequireAuth({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <div className="shell">
      <Topbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/tasks"
          element={
            <RequireAuth>
              <Tasks />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/tasks" replace />} />
      </Routes>
    </div>
  );
}
