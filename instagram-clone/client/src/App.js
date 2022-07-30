

// components
import Login from './components/login/Login';
import Signup from './components/login/Signup';
import Home from './components/home/Home';
import Profile from './components/profile/Profile';
import Header from './components/header/Header';
import DataProvider from './context/DataProvider';

import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ isAuthenticated, ...props }) => {
  const user = sessionStorage.getItem('user');
  return user ? 
    <>
      <Header />
      <Outlet />
    </> : <Navigate replace to='/login' />
};

function App() {

  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>

          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />

          <Route path='/' element={<PrivateRoute />} >
            <Route path='/' element={<Home />} />
          </Route>

          <Route path='/profile' element={<PrivateRoute />} >
            <Route path='/profile' element={<Profile />} />
          </Route>
          
        </Routes>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
