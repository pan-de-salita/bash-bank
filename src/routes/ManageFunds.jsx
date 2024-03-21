import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import BigNumber from 'bignumber.js';
import useLocalStorage from "../utils/LocalStorage"
import Select from 'react-select';

class Transaction {
  constructor(transactionType, transactionAmount, sender, receiver, remarks) {
    this.transactionId = crypto.randomUUID();
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
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const [currentUserBalanceNum, setCurrentUserBalanceNum] = useState(null);
  const [currentUserBalanceStr, setCurrentUserBalanceStr] = useState(null);
  const [transactionType, setTransactionType] = useState(null);
  const [remarks, setRemarks] = useState(null);

  const inputClasses = 'w-full border-b-2 border-solid border-b-[#17171B] border-t-0 border-l-0 border-r-0 p-[5px focus:outline-none focus:ring-0]';
  const customDropdownStyles = {
    control: (base) => ({
      ...base,
      outline: 'none',
      borderRadius: 0,
      border: 'none',
      boxShadow: 'none',
    }),

    option: (styles) => ({
      ...styles,
      '&:hover': {
        backgroundColor: '#b248fe90',
      },
    }),

    dropdownIndicator: (provided) => ({
      ...provided,
      color: '#17171B',
      '&:hover': {
        color: '#17171B',
      }
    })
  };

  const validationSchema = Yup.object().shape({
    transactionAmountInput: Yup
      .number()
      .positive('Must be a positive number')
      .test('is-decimal', 'Up to 2 decimal places only', (value) => {
        const bigValue = new BigNumber(value);
        return bigValue.dp() <= 2;
      })
      .test('is-within-balance', 'Insufficient balance', (value) => {
        const bigValue = new BigNumber(value);
        const bigCurrentUserBalance = new BigNumber(currentUserBalanceNum);
        return transactionType === 'Withdrawal' ? bigValue.toNumber() <= bigCurrentUserBalance.toNumber() : true;
      })
      .typeError('Must be numbers only')
      .required('Balance is required')
  });

  const { control, register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange'
  });

  useEffect(() => {
    const currentUsersFromStorage = JSON.parse(localStorage.getItem('users'));
    setCurrentUsers(currentUsersFromStorage);
  }, [])

  function handleAccountChange(selectedOption, onChange) {
    setCurrentUser(`${selectedOption.firstName} ${selectedOption.lastName}`);
    setCurrentUserId(selectedOption.value);
    setCurrentUserEmail(selectedOption.label);
    setCurrentUserBalanceNum(selectedOption.accountBalance);
    setCurrentUserBalanceStr(formatMoney(selectedOption.accountBalance));
    onChange(selectedOption);
  }

  function handleTransactionChange(selectedOption, onChange) {
    setTransactionType(selectedOption.value);
    onChange(selectedOption);
  }

  function manageFundsReset() {
    reset({
      accountInput: null,
      transactionTypeInput: null,
      transactionAmountInput: ''
    })
  }

  function formatMoney(amount) {
    const amountStr = amount.toString().split('.');
    const integerStr = amountStr[0];
    const decimalStr = amountStr[1];

    if (integerStr.length > 3) {
      const formattedIntegerStr = [...integerStr].reverse().map((intStr, idx) => {
        if ((idx + 1) % 3 === 0 && idx + 1 !== integerStr.length) {
          return ',' + intStr;
        } else {
          return intStr;
        }
      }).reverse().join('');
      return `₱${formattedIntegerStr}${decimalStr ? '.' + decimalStr : '.00'}`;
    }

    return `₱${integerStr}${decimalStr ? '.' + decimalStr : '.00'}`;
  }

  function onSubmit(data) {
    const newTransaction = new Transaction(
      data.transactionTypeInput.label,
      data.transactionAmountInput,
      data.accountInput.label,
      data.accountInput.label,
      data.remarksInput
    );
    console.log(newTransaction)

    // TODO: update user balance
    // TODO: update user transaction history
  }

  return (
    <>
      <div className='relative w-full h-full flex flex-col justify-center items-center'>
        <div className='border-none md:shadow-custom-manage-funds lg:shadow-custom-manage-funds p-10 md:p-14 lg:p-14 w-full md:w-[34rem] lg:w-[40rem] overflow-y-auto flex flex-col'>
          <h2 className='text-4xl md:text-5xl lg:text-5xl font-bold pt-20 md:pt-0 lg:pt-0 pb-5 self-start'>Manage Funds</h2>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            <label className='flex flex-col'>
              <span className='text-lg font-[600]'>Account</span>
              <div className='border-[2px] border-solid border-[#17171B]'>
                <Controller
                  control={control}
                  name="accountInput"
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder='Select an account'
                      onChange={(selectedOption) => handleAccountChange(selectedOption, field.onChange)}
                      options={currentUsers.map(({ firstName, lastName, email, userId, accountBalance }) => {
                        return { value: `${userId}`, label: `${email}`, accountBalance, firstName, lastName };
                      })}
                      styles={customDropdownStyles}
                      required={true}
                    />
                  )}
                />
                <div className={currentUser && currentUserBalanceStr ? 'flex flex-col items-end justify-center p-[0.5rem] h-[5rem] border-t-[2px] border-solid border-t-[#17171B] border-l-0 border-r-0 border-b-0 bg-[#b248fe] text-white font-[600] text-md md:text-lg lg:text-lg' : 'hidden'}>
                  <h3>User: {currentUser}</h3>
                  <h3>Balance: {currentUserBalanceStr}</h3>
                </div>
              </div>
            </label>
            <label className='flex flex-col'>
              <span className='text-lg font-[600]'>Transaction type</span>
              <div className='border-[2px] border-solid border-[#17171B]'>
                <Controller
                  control={control}
                  name="transactionTypeInput"
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder='Deposit or Withdrawal?'
                      onChange={(selectedOption) => handleTransactionChange(selectedOption, field.onChange)}
                      options={[
                        { value: 'Deposit', label: 'Deposit' },
                        { value: 'Withdrawal', label: 'Withdrawal' }
                      ]}
                      styles={customDropdownStyles}
                      required={true}
                    />
                  )}
                />
              </div>
            </label>
            <label>
              <span className='text-lg font-[600]'>Amount</span>
              <input {...register('transactionAmountInput')} className={inputClasses} type='text' placeholder='0.00' required={true} autoComplete='off' />
              {errors.transactionAmountInput && <p className='bg-[#17171B] text-white p-1 font-[500] italic'>{errors.transactionAmountInput.message}</p>}
            </label>
            <label>
              <span className='text-lg font-[600]'>Remarks</span>
              <textarea {...register('remarksInput')} className='w-full h-[5rem] p-2 border-2 border-solid border-[#17171B] p-[5px focus:outline-none focus:ring-0]' placeholder='Optional' autoComplete='off' />
            </label>
            <div className='flex justify-end gap-3 pb-10 md:pb-0 lg:pb-0'>
              <button onClick={() => manageFundsReset()} className='w-[35%] mt-6 p-[0.5rem] md:p-[0.6rem] lg:p-[0.7rem] text-md font-[800] hover:translate-y-[-2px] active:translate-y-[2px]'>Cancel</button>
              <button type='submit' className='w-[35%] bg-[#b248fe] mt-6 p-[0.5rem] md:p-[0.6rem] lg:p-[0.7rem] text-md font-[800] hover:translate-y-[-2px] active:translate-y-[2px]'>Submit</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
