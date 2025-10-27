// import './App.css';
// import './index.css';
// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import ErrorPage from './error-page.tsx';
// import About from './pages/about.tsx';
// import Home from './pages/home.tsx';
// import Sponsor from './pages/sponsor.tsx';
// import Exhibitor from './pages/exhibitor.tsx';
// import Speakers from './pages/speakers.tsx';
// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <Home />,
//     errorElement: <ErrorPage />
//   },
//   {
//     path: '/about',
//     element: <About />,
//     errorElement: <ErrorPage />
//   },
//   {
//     path: '/sponsor',
//     element: <Sponsor />,
//     errorElement: <ErrorPage />
//   },
//   {
//     path: '/speaker',
//     element: <Speakers />,
//     errorElement: <ErrorPage />
//   },
//   {
//     path: '/exhibitors',
//     element: <Exhibitor />,
//     errorElement: <ErrorPage />
//   },
//   {
//     path: '/about',
//     element: <About />,
//     errorElement: <ErrorPage />
//   },
//   {
//     path: '/about',
//     element: <About />
//   }
// ]);
// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     {/* <App> */}
//     <RouterProvider router={router} />
//     {/* </App> */}
//   </StrictMode>
// );

import './App.css';
import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './error-page.tsx';
import About from './pages/about.tsx';
import Home from './pages/home.tsx';
import Sponsor from './pages/sponsor.tsx';
// import Exhibitor from './pages/exhibitor.tsx';
import Speakers from './pages/speakers.tsx';
import PastSpeakers from './pages/past-speaker.tsx';
import Statistics from './pages/statistics.tsx';
import Exhibitors from './pages/register/exhibitors.tsx';
import Sponsors from './pages/register/sponsors.tsx';
import Applicants from './pages/applicants.tsx';
// import HomePage from './pages/HomePage.tsx';
import { NuqsAdapter } from 'nuqs/adapters/react';
import Register from './pages/register/index.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorPage />
  },
  // {
  //   path: '/home',
  //   element: <HomePage />,
  //   errorElement: <ErrorPage />
  // },
  {
    path: '/about',
    element: <About />,
    errorElement: <ErrorPage />
  },
  {
    path: '/sponsor',
    element: <Sponsor />,
    errorElement: <ErrorPage />
  },
  {
    path: '/speaker',
    element: <Speakers />,
    errorElement: <ErrorPage />
  },
  {
    path: '/past-speaker',
    element: <PastSpeakers />,
    errorElement: <ErrorPage />
  },

  {
    path: '/statistics',
    element: <Statistics />,
    errorElement: <ErrorPage />
  },
  {
    path: '/PAN4BiB92wD5tRezRzr9UlpCknElsOpSf3Zf5CtPnpE/applicants',
    element: <Applicants />,
    errorElement: <ErrorPage />
  },
  {
    path: '/register/exhibitors',
    element: <Exhibitors />,
    errorElement: <ErrorPage />
  },
  {
    path: '/register/',
    element: <Register />,
    errorElement: <ErrorPage />
  },
  {
    path: '/register/sponsors',
    element: <Sponsors />,
    errorElement: <ErrorPage />
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NuqsAdapter>
      <RouterProvider router={router} />
    </NuqsAdapter>
  </StrictMode>
);
