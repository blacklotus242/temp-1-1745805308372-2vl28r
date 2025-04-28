import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { Eye, EyeOff } from 'lucide-react';
import '@fontsource/space-grotesk';
import '@fontsource/righteous';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        addNotification('Successfully logged in!', 'success');
        navigate('/dashboard');
      } else {
        addNotification('Invalid credentials', 'error');
      }
    } catch (error) {
      addNotification('An error occurred during login', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{
        backgroundImage: "url('https://images.pexels.com/photos/2150/sky-space-dark-galaxy.jpg?auto=compress&cs=tinysrgb&w=1920')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay with reduced opacity */}
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="space-y-2">
          <h2 
            className="cosmic-text text-center text-4xl font-bold whitespace-nowrap"
            style={{ fontFamily: 'Righteous' }}
          >
            You can create anything
          </h2>
          <p className="cosmic-subtext text-center text-lg">
            Your journey begins here
          </p>
        </div>

        <form 
          method="post" 
          className="mt-8 space-y-6 bg-black/30 backdrop-blur-md p-8 rounded-2xl border border-white/20" 
          onSubmit={handleSubmit} 
          autoComplete="on"
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-white/20 placeholder-gray-300 text-white bg-black/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-white/20 placeholder-gray-300 text-white bg-black/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="enter-galaxy cosmic-button group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
            >
              <span>{isLoading ? 'Entering...' : 'Enter the Galaxy'}</span>
            </button>
          </div>

          <div className="text-center">
            <Link 
              to="/register" 
              className="inline-block"
            >
              <p className="text-sm">
                <span className="signup-cosmic hover:opacity-80 transition-opacity cursor-pointer">
                  Let's start your creation - Sign up
                </span>
              </p>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}