import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import MobileHomeButton from '../components/MobileHomeButton';

export default function Root() {
  return (
    <>
      <div className='w-screen h-screen flex flex-col-reverse md:flex-row lg:flex-row'>
        <Sidebar />
        <div className='w-full h-screen flex justify-center items-center overflow-y-auto'>
          <Outlet />
        </div>
        <MobileHomeButton />
      </div>
    </>
  );
}
