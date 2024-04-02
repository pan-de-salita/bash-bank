import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { SiGnubash } from "react-icons/si";
import useLocalStorage from '../utils/useLocalStorage';
import { toastError, toastSuccess } from '../utils/toasts';
import { useEffect } from 'react';

export default function Login() {
  const inputClasses = 'bg-transparent w-[15rem] md:w-[20rem] md:w-[20rem] border-b-2 border-solid border-b-white border-t-0 border-l-0 border-r-0 p-[5px focus:outline-none focus:ring-0] text-white';

  const [users, setUsers] = useLocalStorage('users', []);
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage('isLoggedIn', false);
  const navigate = useNavigate();

  const { control, register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    mode: 'onChange'
  });

  useEffect(() => {
    setIsLoggedIn(false);
    if (users.length < 1) {
      setUsers([
        {
          firstName: 'root',
          lastName: 'access',
          email: 'admin@bash.com',
          password: 'bashadmin',
          userId: crypto.randomUUID(),
          isAdmin: true,
          accountBalance: 0,
          transactions: [],
        }
      ]);
    }
  }, [])

  function onSubmit(data) {
    const userMatch = users.find(({ email }) => data.Email === email);

    if (userMatch && data.Password === userMatch.password && userMatch.isAdmin) {
      toastSuccess(`Welcome back, ${userMatch.firstName} ${userMatch.lastName}. Logging you in now.`)
      if (!isLoggedIn) {
        setIsLoggedIn(true);
      }
      setTimeout(() => {
        navigate('/root');
      }, 3000)
    } else {
      toastError('Invalid email or password. Please try again.')
    }
  }

  return (
    <>
      <div className='w-screen h-screen flex flex-col justify-center items-center'>
        <div className='shadow-custom-add-user flex flex-col items-center justify-center gap-5 w-[90%] md:w-[50%] lg:w-[40%] h-[70%] md:h-[60%] lg:h-[60%] bg-black'>
          <div className='flex flex-col justify-center items-center'>          <SiGnubash className='block' size={85} color='#b248fe' />
            <span className='hidden md:block lg:block w-[60%] text-white text-center text-xl pt-[2rem]'>Get sudo priviliges over your finances.</span>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className='w-full flex flex-col justify-center items-center gap-4 py-[3rem]'>
            <label className='flex flex-col'>
              <span className='text-lg font-[600] text-white'>Email</span>
              <input {...register('Email')} className={inputClasses} type='text' placeholder='' required={true} autoComplete='off' />
            </label>
            <label className='flex flex-col'>
              <span className='text-lg font-[600] text-white'>Password</span>
              <input {...register('Password')} className={inputClasses} type='password' placeholder='' required={true} autoComplete='off' />
            </label>
            <button type='submit' className='w-[35%] bg-[#b248fe] mt-[3rem] p-[0.5rem] md:p-[0.6rem] lg:p-[0.7rem] text-md font-[800] hover:translate-y-[-2px] active:translate-y-[2px]'>Login</button>
          </form>
        </div>
      </div>
    </>
  );
}
