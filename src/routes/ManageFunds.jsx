import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useLocalStorage from "../utils/LocalStorage"
import Select from 'react-select';

class Transactions {
  constructor(transactionType, transactionAmount, sender, receiver, remarks) {
    this.transactionType = transactionType;
    this.transactionAmount = transactionAmount;
    this.sender = sender;
    this.receiver = receiver;
    this.time = new Date().toString();
    this.remarks = remarks;
  }
}

export default function ManageFunds() {
  const [currentUsers, setCurrentUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState('');

  const inputClasses = 'w-full border-b-2 border-solid border-b-gray-400 border-t-0 border-l-0 border-r-0 p-[5px focus:outline-none focus:ring-0]';

  useEffect(() => {
    const currentUsersFromStorage = JSON.parse(localStorage.getItem('users'));
    setCurrentUsers(currentUsersFromStorage);
  }, [])

  function handleDropdownChange() {
    console.log('wah');
  }

  return (
    <>
      <div className='relative w-full h-full flex flex-col justify-center items-center overflow-hidden'>
        <div className='border-none md:shadow-custom-manage-funds lg:shadow-custom-manage-funds p-10 md:p-14 lg:p-14 w-[25rem] md:w-[34rem] lg:w-[40rem]'>
          <h2 className='text-4xl md:text-5xl lg:text-5xl font-bold pb-5 self-start'>Funds</h2>
          <form className='flex flex-col gap-4' autoComplete='nope'>
            <label className='flex flex-col'>
              <span className='text-lg font-[600]'>Account</span>
              <Select
                defaultValue='wah'
                onChange={handleDropdownChange}
                options={currentUsers.map(({ email }) => {
                  return { value: `${email}`, label: `${email}` };
                })}
              />
            </label>
            <h3>Available Balance:</h3>
          </form>
        </div>
      </div>
    </>
  )
}
