import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import useLocalStorage from '../utils/useLocalStorage';
import { toastSuccess, toastError } from '../utils/toasts';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';

class User {
  constructor(firstName, lastName, email, password, accountBalance) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.userId = crypto.randomUUID();
    this.isAdmin = false;
    this.accountBalance = accountBalance;
    this.transactions = [];
  }
}

export default function CreateUser() {
  const [users, setUsers] = useLocalStorage('users', []);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const inputClasses = 'w-full border-b-2 border-solid border-b-gray-400 border-t-0 border-l-0 border-r-0 p-[5px focus:outline-none focus:ring-0]';

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().matches(/^[a-zA-Z ]*$/, 'Must be letters only').required('First name is required'),
    lastName: Yup.string().matches(/^[a-zA-Z ]*$/, 'Must be letters only').required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(8, 'Must be at least 6 chars').required('Password is required'),
    accountBalance: Yup.number().typeError('Must be numbers only').required('Balance is required')
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange'
  });

  function onSubmit(data) {
    const newUser = new User(
      data.firstName,
      data.lastName,
      data.email,
      data.password,
      data.accountBalance);

    if (!isDuplicateUser(newUser, users)) {
      setUsers(prevUsers => [...prevUsers, newUser]);
      toastSuccess(`${data.firstName} added to etc/passwd!`);
      reset();
    } else {
      toastError('Error: Email already exists.');
    }
  }

  function isDuplicateUser(newUser, existingUsers) {
    return existingUsers.some(user => user.email === newUser.email);
  }

  return (
    <>
      <div className='relative w-full h-full flex flex-col justify-center items-center overflow-hidden'>
        <div className='border-none md:shadow-custom-add-user lg:shadow-custom-add-user p-10 md:p-14 lg:p-14 w-[25rem] md:w-[34rem] lg:w-[40rem]'>
          <h2 className='text-4xl md:text-5xl lg:text-5xl font-bold pb-5 self-start'>Add User</h2>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            <div className='flex gap-6'>
              <label>
                <span className='text-lg font-[600]'>First name</span>
                <input {...register('firstName')} className={inputClasses} type='text' placeholder='Brian' required={true} autoComplete='off' />
                {errors.firstName && <p className='bg-[#17171B] text-white p-1 font-[500] italic'>{errors.firstName.message}</p>}
              </label>
              <label>
                <span className='text-lg font-[600]'>Last name</span>
                <input {...register('lastName')} className={inputClasses} type='text' placeholder='Fox' required={true} autoComplete='off' />
                {errors.lastName && <p className='bg-[#17171B] text-white p-1 font-[500] italic'>{errors.lastName.message}</p>}
              </label>
            </div>
            <label>
              <span className='text-lg font-[600]'>Email</span>
              <input {...register('email')} className={inputClasses} type='text' placeholder='brian_fox@protonmail.com' required={true} autoComplete='off' />
              {errors.email && <p className='bg-[#17171B] text-white p-1 font-[500] italic'>{errors.email.message}</p>}
            </label>
            <label>
              <span className='text-lg font-[600]'>Password</span>
              <div className='relative'>
                <input {...register('password')} className={inputClasses} type={isPasswordVisible ? 'text' : 'password'} placeholder='At least 6 chars long' required={true} autoComplete='new-password' />
                {isPasswordVisible ?
                  <IoMdEyeOff className='cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2' size={25} color='#b248fe' onClick={() => setIsPasswordVisible(false)} />
                  : <IoMdEye className='cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2' size={25} color='#b248fe' onClick={() => setIsPasswordVisible(true)} />}
              </div>
              {errors.password && <p className='bg-[#17171B] text-white p-1 font-[500] italic'>{errors.password.message}</p>}
            </label>
            <label>
              <span className='text-lg font-[600]'>Initial balance</span>
              <input {...register('accountBalance')} className={inputClasses} type='text' placeholder='0.00' required={true} autoComplete='off' />
              {errors.accountBalance && <p className='bg-[#17171B] text-white p-1 font-[500] italic'>{errors.accountBalance.message}</p>}
            </label>
            <div className='flex justify-end gap-3'>
              <button onClick={() => reset()} className='w-[35%] mt-6 p-[0.5rem] md:p-[0.6rem] lg:p-[0.7rem] text-md font-[800] hover:translate-y-[-2px] active:translate-y-[2px]'>Cancel</button>
              <button type='submit' className='w-[35%] bg-[#b248fe] mt-6 p-[0.5rem] md:p-[0.6rem] lg:p-[0.7rem] text-md font-[800] hover:translate-y-[-2px] active:translate-y-[2px]'>Submit</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
