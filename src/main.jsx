import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import Login from './routes/Login';
import Root from './routes/Root';
import Overview from './routes/Overview';
import CreateUser from './routes/CreateUser';
import ManageFunds from './routes/ManageFunds';
import './index.css';
import { ToastContainer } from 'react-toastify';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = JSON.parse(localStorage.getItem('isLoggedIn'));

  if (!isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  return children;
}

const BankingApp = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/root',
    element: (
      <PrivateRoute>
        <Root />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Overview />,
      },
      {
        path: 'overview',
        element: <Overview />,
      },
      {
        path: 'create-user',
        element: <CreateUser />,
      },
      {
        path: 'manage-funds',
        element: <ManageFunds />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={BankingApp} />
    <ToastContainer />
  </React.StrictMode>,
)
