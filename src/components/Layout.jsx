import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <>
      <Header isHomePage={isHomePage} />
      <main>
        <Outlet /> 
      </main>
    </>
  );
};

export default Layout;