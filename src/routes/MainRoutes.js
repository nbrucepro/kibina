import { lazy } from 'react';
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import { Navigate,Outlet } from 'react-router-dom';
import Login from 'pages/login/index';
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));
const Kuguza = Loadable(lazy(() => import('pages/kuguza')));
const Gutira = Loadable(lazy(() => import('pages/gutira')));
const Users = Loadable(lazy(() => import('pages/users')));

const usersmString = localStorage.getItem("userm");
const usersm = usersmString ? JSON.parse(usersmString) : null;
const isLoggedIn =usersm ? true : false;
const MainRoutes = 
[
  {
    path: 'app/',
    element: !isLoggedIn ? <Navigate to="/login" /> : <MainLayout />,
  children: [
    {
      path: '/app/gutura',
      element: <DashboardDefault />
    },
    {
      path: '/app/kuguza',
      element: <Kuguza />
    },
    {
      path: '/app/gutira',
      element: <Gutira />
    },
    {
      path: '/app/members',
      element: <Users />
    },
    { path: '/app/', element: <Navigate to="/app/gutura" /> }
    ,
    // {
    //   path: 'dashboard',
    //   children: [
    //     {
    //       path: 'default',
    //       element: <DashboardDefault />
    //     }
    //   ]
    // }
  ]
},
{
  path: '/',
  // element: <Login />,
  element: !isLoggedIn ? <Login /> : <Navigate to="/app/gutura" />,
  children: [
    { path: 'login', element: <Login /> },
    { path: '/', element: <Navigate to="/login" /> },
  ],
},
]
export default MainRoutes;
