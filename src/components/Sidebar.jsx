import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SiGnubash } from "react-icons/si";
import { CgProfile } from "react-icons/cg";
import { LuGitPullRequestDraft } from "react-icons/lu";
import { SiAirtable } from "react-icons/si";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md";

export default function Sidebar() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleWindowResize() {
      const newWindowWidth = window.innerWidth;
      newWindowWidth < 777 ? setIsSidebarOpen(true) : setIsSidebarOpen(false);
      setWindowWidth(newWindowWidth);
    }

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  function handleOpenSidebar() {
    setIsSidebarOpen(!isSidebarOpen);
  }

  function isActive(path) {
    return location.pathname === path;
  }

  function getNavClasses() {
    const baseClasses = 'w-screen p-0 md:p-7 lg:p-7 flex justify-around md:flex-col lg:flex-col md:justify-center lg:justify-center gap-4 bg-[#17171B]';
    const width = isSidebarOpen ? 'md:w-[38%] lg:w-[20%]' : 'md:w-[5rem] lg:w-[5rem]';
    const transitionClasses = 'transition-all duration-300 ease-in-out';
    return `${baseClasses} ${width} ${transitionClasses}`;
  }

  function getLinkClass(path, isActivePath) {
    const baseClasses = 'flex flex-col p-2 md:p-0 lg:p-0 md:flex-row lg:flex-row items-center gap-0 md:gap-4 lg:gap-4 transition-transform duration-200 ease-in-out';
    const textColor = isActivePath(path) ? 'text-white hover:text-white' : 'text-[#A9A9AB] hover:text-white';
    const translateY = isActivePath(path) ? '' : 'hover:translate-y-[-4px] hover:text-[#b248fe]';
    return `${baseClasses} ${textColor} ${translateY}`;
  }

  return (
    <>
      <nav className={getNavClasses()}>
        <div className='hidden md:flex lg:flex flex-col items-center'>
          <SiGnubash className='hidden md:block lg:block' size={isSidebarOpen ? 85 : 50} color='#b248fe' />
          <span className='sm:block text-sm md:text-xl lg:text-2xl text-[#b248fe]'>
            {isSidebarOpen ? 'B A S H _' : ''}
          </span>
        </div>
        {/*  TODO: refactor using .map */}
        <ul className='w-full md:h-screen lg:h-screen flex md:flex-col lg:flex-col justify-around md:gap-8 lg:gap-8 md:pt-[3.8rem] lg:pt-[3.8rem]'>
          <li className='flex'>
            <Link className={getLinkClass('/root/overview', isActive)} to='/root/overview'>
              <SiAirtable className='scale-[0.7] md:scale-[1] lg:scale-[1]' size={25} />
              <span className='sm:block text-[0.7rem] md:text-lg lg:text-xl'>
                {isSidebarOpen ? 'Overview' : ''}
              </span>
            </Link>
          </li>
          <li className='flex'>
            <Link className={getLinkClass('/root/create-user', isActive)} to='/root/create-user'>
              <CgProfile className='scale-[0.7] md:scale-[1] lg:scale-[1]' size={25} />
              <span className='sm:block text-[0.7rem] md:text-lg lg:text-xl'>
                {isSidebarOpen ? 'Create User' : ''}
              </span>
            </Link>
          </li>
          <li className='flex'>
            <Link className={getLinkClass('/root/manage-funds', isActive)} to='/root/manage-funds'>
              <LuGitPullRequestDraft className='scale-[0.7] md:scale-[1] lg:scale-[1]' size={25} />
              <span className='sm:block text-[0.7rem] md:text-lg lg:text-xl'>
                {isSidebarOpen ? 'Manage Funds' : ''}
              </span>
            </Link>
          </li>
          <div className='h-full flex flex-col justify-between'>
            <div className='hidden md:block lg:block'></div>
            <li>
              <div className='flex justify-between'>
                <Link className={`${getLinkClass('/', isActive)} ${isSidebarOpen ? 'block' : 'hidden'}`} to='/'>
                  <RiLogoutCircleRLine className='scale-[0.7] md:scale-[1] lg:scale-[1]' size={25} />
                  <span className='sm:block text-[0.7rem] md:text-lg lg:text-xl md:pr-[1rem] lg:pr-[1rem]'>
                    {isSidebarOpen ? 'Logout' : ''}
                  </span>
                </Link>
                <div>
                  {isSidebarOpen ? (
                    <MdKeyboardDoubleArrowLeft className='cursor-pointer hidden md:block lg:block transition-transform duration-200 ease-in-out hover:translate-x-[-5px]' size={30} color='#b248fe' onClick={handleOpenSidebar} />
                  ) : (
                    <MdKeyboardDoubleArrowRight className='cursor-pointer hidden md:block lg:block transition-transform duration-200 ease-in-out hover:translate-x-[5px]' size={30} color='#b248fe' onClick={handleOpenSidebar} />
                  )}
                </div>
              </div>
            </li>
          </div>
        </ul>
      </nav>
    </>
  )
}
