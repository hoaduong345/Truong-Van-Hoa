import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ChildLayout from '../layouts/ChildLayout';
import HomePage from '../pages/HomePage';

// Import your page components here
const About = () => <div>About Page</div>;
const Contact = () => <div>Contact Page</div>;

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'about',
        element: (
          <ChildLayout title="About Us" description="Learn more about our company">
            <About />
          </ChildLayout>
        ),
      },
      {
        path: 'contact',
        element: (
          <ChildLayout title="Contact Us" description="Get in touch with us">
            <Contact />
          </ChildLayout>
        ),
      },
    ],
  },
]); 