import React from 'react'
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Verify from './pages/Verify';
import VerifyEmail from './pages/VerifyEmail';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Footer from './components/Footer';
import Profile from './pages/Profile';
import Products from './pages/products';
import Cart from './pages/Cart';
import Dashboard from './pages/Dashboard';
import AdminSalse from './pages/admin/AdminSalse';
import AddProduct from './pages/admin/AddProduct';
import AdminProduct from './pages/admin/AdminProduct';
import AdminOrders from './pages/admin/AdminOrders';
import ShowUserOrders from './pages/admin/ShowUserOrders';
import AdminUsers from './pages/admin/AdminUsers';
import UserInfo from './pages/admin/UserInfo';
import ProtectedRoutes from './components/ProtectedRoutes';
import SinglaProduct from './pages/SinglaProduct';
import Features from './components/Features';
import AddressForm from './pages/AddressForm';
import OrderSuccess from './pages/OrderSuccess';
import Contact from './pages/Contact';
import ScrollToTop from './components/ScrollToTop';
import ForgetPass from './pages/ForgetPass';
import ResetPassword from './pages/ResetPassword';






const router = createBrowserRouter([
  {
    path: '/',
    element: <><ScrollToTop /> <Navbar />  <Home />  <Footer /></>
  },
  {
    path: '/signup',
    element: <> <ScrollToTop /> <Signup /> </>
  },
  {
    path: '/login',
    element: <> <Login /> </>
  },
  {
    path: '/verify',
    element: <> <Verify /> </>
  },
  {
    path: '/verify/:token',
    element: <> <VerifyEmail /> </>
  },
  {
    path: '/profile/:userId',
    element: <ProtectedRoutes > <Navbar /><Profile />  <Footer /> </ProtectedRoutes>
  },
  {
    path: '/products',
    element: <><Navbar /> <Products /> <Footer /> </>
  },
  {
    path: '/cart',
    element: <><Navbar /> <Cart /> <Footer /></>
  },
  {
    path: '/address',
    element: <> <Navbar /> <AddressForm /> </>
  },
  {
    path: '/order-success',
    element: <> <Navbar /> <OrderSuccess /> </>
  },
  {
    path: '/products/:id',
    element: <><Navbar /><SinglaProduct /> <Features /> <Footer /> </>
  },
  {
    path: '/contact',
    element: <><Navbar /><Contact /> <Footer /> </>
  },
  {
    path: '/forgot-password',
    element: <><Navbar /> <ForgetPass /> <Footer /> </>
  },
  {
    path: '/reset-password',
    element: <><Navbar /> <ResetPassword /> <Footer /> </>
  },


  {
    path: '/dashboard',
    element: (
      <ProtectedRoutes adminOnly={true}>
        <Navbar />
        <Dashboard />
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "salse",
        element: <AdminSalse />
      },
      {
        path: "add-product",
        element: <AddProduct />
      },
      {
        path: "Products",
        element: <AdminProduct />
      },
      {
        path: "orders",
        element: <AdminOrders />
      },
      {
        path: "users/orders/:userId",
        element: <ShowUserOrders />
      },
      {
        path: "users",
        element: <AdminUsers />
      },
      {
        path: "users/:id",
        element: <UserInfo />
      },
    ]
  },
])



const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>

  )
}

export default App;