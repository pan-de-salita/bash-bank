import { Link } from 'react-router-dom';
import { SiGnubash } from "react-icons/si";

export default function MobileHomeButton() {
  return (
    <>
      <Link to=''>
        <button className='z-50 block md:hidden lg:hidden absolute top-0 right-0 p-2.5 bg-[#b248fe] rounded-none rounded-bl-xl shadow-2xl hover:shadow-none'>
          <SiGnubash className='transition-transform duration-200 ease-in-out hover:scale-[1.08]' size={50} color='#17171B' />
        </button>
      </Link>
    </>
  );
}
