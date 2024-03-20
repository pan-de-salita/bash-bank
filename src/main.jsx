import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import Login from './routes/Login';
import Root from './routes/Root';
import CreateUser from './routes/CreateUser';
import ManageFunds from './routes/ManageFunds';
import './index.css'
import { ToastContainer } from 'react-toastify';
import Transfer from './routes/Transfer';

const BankingApp = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/root',
    element: <Root />,
    children: [
      // remove later on
      {
        index: true,
        element: <CreateUser />,
      },
      {
        path: 'create-user',
        element: <CreateUser />,
      },
      {
        path: 'manage-funds',
        element: <ManageFunds />,
      },
      {
        path: 'transfer',
        element: <Transfer />,
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={BankingApp} />
    <ToastContainer />
  </React.StrictMode>,
)
