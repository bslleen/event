import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout({ isAdmin = false }) {
  return (
    <div className="app-layout">
      <Sidebar isAdmin={isAdmin} />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
