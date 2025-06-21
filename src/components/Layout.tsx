// src/components/Layout.js
// import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    // <div className="min-h-screen grid grid-rows-[auto_1fr] grid-cols-1 lg:grid-cols-[auto_1fr]">
    //   {/* Navbar */}
    //   <nav className="bg-blue-600 text-white p-4 row-span-1 lg:col-span-2">
    //     <h1 className="text-xl font-bold">My Navbar</h1>
    //   </nav>

    //   {/* Aside Section */}
    //   <aside className="bg-gray-200 p-4 row-span-1 lg:row-span-2">
    //     <h2 className="text-lg font-semibold">Aside Section</h2>
    //     <p>Some aside content here...</p>
    //   </aside>

    //   {/* Main Section */}
    //   <main className="bg-white p-4 row-span-1">
    //     <h2 className="text-lg font-semibold">Main Section</h2>
    //     <p>Some main content here...</p>
    //   </main>
    // </div>
    <div className="min-h-screen bg-slate-100 grid grid-rows-[auto_1fr] grid-cols-[auto_1fr] bg-img">
      <Header />

      <Outlet />
    </div>
  );
};

export default Layout;
