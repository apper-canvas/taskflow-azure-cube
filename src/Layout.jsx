import { Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { AuthContext } from './App';
import ApperIcon from './components/ApperIcon';

function Layout() {
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Header with logout */}
      {isAuthenticated && (
        <header className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold flex items-center justify-center">
                T
              </div>
              <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <div className="text-sm text-gray-600">
                  Welcome, {user.firstName || user.name || 'User'}
                </div>
              )}
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="LogOut" className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </header>
      )}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;