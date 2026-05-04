import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-background dark:bg-dark-background">
      <Sidebar />
      <div className="flex-1 ml-0 md:ml-64">
        <Topbar />
        <main className="pt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;