import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
     
      <main className="flex-1 bg-gray-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;