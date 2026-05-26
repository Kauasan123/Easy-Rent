import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const LayoutPrivado = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-white h-screen overflow-y-auto">
        <Outlet /> 
      </main>
    </div>
  );
};

export default LayoutPrivado;