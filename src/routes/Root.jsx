import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileHomeButton from '../MobileHomeButton';

export default function Root() {
  return (
    <>
      <div className='w-screen h-screen flex flex-col-reverse md:flex-row lg:flex-row'>
        <Sidebar />
        <div className='w-full h-screen flex justify-center items-center'>
          <Outlet />
        </div>
        <MobileHomeButton />
      </div>
    </>
  );
}
