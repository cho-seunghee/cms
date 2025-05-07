import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
// import { hasPermission } from './utils/authUtils';
import useStore from './store/store';
import MainLayout from './components/main/MainLayout';
import './index.css';

// Dynamically import all .jsx files in pages folder and subfolders
const modules = import.meta.glob('/src/pages/**/*.jsx', { eager: false });

// Generate routes from module paths
const routes = Object.keys(modules).map((path) => {
  const pathMatch = path.match(/\/src\/pages\/(.*)\.jsx$/);
  if (!pathMatch) return null;
  const relativePath = pathMatch[1];
  const name = relativePath.split('/').pop();

  const isPublic = name.toLowerCase() === 'login';
  let permission = isPublic ? null : name.toLowerCase();
  let routePath;

  if (name.toLowerCase() === 'login') {
    routePath = '/';
  } else if (name.toLowerCase() === 'mainhome') {
    routePath = '/main';
  } else {
    // Preserve exact path from file structure, only converting to lowercase
    routePath = `/${relativePath.toLowerCase()}`;
    // Special case for specific routes to match menu.json
    // if (name.toLowerCase() === 'tabulatordirect') {
    //   routePath = '/sample/TabulatorDirect';
    // }
  }

  // Map board-related routes to mainBoard permission
  if (['board', 'boardview', 'boardwrite'].includes(name.toLowerCase())) {
    permission = 'mainBoard';
  }

  return {
    path: routePath,
    component: lazy(modules[path]),
    public: isPublic,
    permission,
  };
}).filter(Boolean);

const App = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '') {
      if (user) {
        navigate('/main', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [user, navigate, location.pathname]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {routes.map(({ path, component, public: isPublic }) => {
          const Component = component;
          if (isPublic) {
            // Public route (login): redirect to /main if authenticated
            return (
              <Route
                key={path}
                path={path}
                element={user ? <Navigate to="/main" replace /> : <Component />}
              />
            );
          }
          // Protected routes: render within MainLayout if authenticated
          return (
            <Route
              key={path}
              path={path}
              element={
                user ? (
                  <MainLayout />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            >
              <Route path="" element={<Component />} />
            </Route>
          );
        })}
        {/* Catch-all route for unrecognized paths */}
        <Route path="*" element={<Navigate to={user ? "/main" : "/"} replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;