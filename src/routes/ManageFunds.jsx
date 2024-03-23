import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import BigNumber from 'bignumber.js';
import useLocalStorage from '../utils/useLocalStorage';
import Select from 'react-select';
import { toastSuccess } from '../utils/toasts';
import ManageFundsTable from '../components/ManageFundsTable';

class Transaction {
  constructor(transactionType, transactionAmount, sender, receiver, remarks) {
    this.transactionId = crypto.randomUUID();
    this.transactionType = transactionType;
    this.transactionAmount = transactionAmount;
    this.sender = sender;
    this.receiver = receiver;
    this.time = new Date().toLocaleString([], {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    this.remarks = remarks;
  }
}

export default function ManageFunds() {
  // NOTE: use custom hook to manage multiple states?
  const [users, setUsers] = useLocalStorage('users', []);

  const [transactionType, setTransactionType] = useState(null);

  const [senderConfirmed, setSenderConfirmed] = useState(false);
  const [sender, setSender] = useState(null);
  const [senderEmail, setSenderEmail] = useState(null);
  const [senderId, setSenderId] = useState(null);
  const [senderBalanceNum, setSenderBalanceNum] = useState(null);
  const [senderBalanceStr, setSenderBalanceStr] = useState(null);

  const [receiver, setReceiver] = useState(null);
  const [receiverEmail, setReceiverEmail] = useState(null);
  const [receiverId, setReceiverId] = useState(null);
  const [receiverBalanceNum, setReceiverBalanceNum] = useState(null);
  const [receiverBalanceStr, setReceiverBalanceStr] = useState(null);

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
        const bigSenderBalance = new BigNumber(senderBalanceNum);
        return transactionType === 'Withdrawal' || transactionType === 'Transfer' ? bigValue.toNumber() <= bigSenderBalance.toNumber() : true;
      })
      .typeError('Must be numbers only')
      .required('Amount is required')
  });

  const { control, register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange'
  });

  function handleSenderChange(selectedOption, onChange) {
    setSender(`${selectedOption.firstName} ${selectedOption.lastName}`);
    setSenderId(selectedOption.value);
    setSenderEmail(selectedOption.label);
    setSenderBalanceNum(selectedOption.accountBalance);
    setSenderBalanceStr(formatMoney(selectedOption.accountBalance));
    setSenderConfirmed(true);

    setReceiver(null);
    setReceiverId(null);
    setReceiverEmail(null);
    setReceiverBalanceNum(null);
    setReceiverBalanceStr(null);

    setValue('receiverInput', null);

    onChange(selectedOption);
  }

  function handleReceiverChange(selectedOption, onChange) {
    setReceiver(`${selectedOption.firstName} ${selectedOption.lastName}`);
    setReceiverId(selectedOption.value);
    setReceiverEmail(selectedOption.label);
    setReceiverBalanceNum(selectedOption.accountBalance);
    setReceiverBalanceStr(formatMoney(selectedOption.accountBalance));

    onChange(selectedOption);
  }

  function handleTransactionTypeChange(selectedOption, onChange) {
    setTransactionType(selectedOption.value);

    onChange(selectedOption);
  }

  function customReset() {
    reset({
      senderInput: null,
      transactionTypeInput: null,
      receiverInput: null,
      transactionAmountInput: null,
      remarksInput: null
    });

    setTransactionType(null);
    setSender(null);
    setSenderBalanceStr(null);
    setReceiver(null);
    setReceiverBalanceStr(null);
  }

  function formatMoney(amount) {
    const amountStr = (Math.round((amount + Number.EPSILON) * 100) / 100).toString().split('.');
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
      data.senderInput.label,
      receiver ? data.receiverInput.label : data.senderInput.label,
      data.remarksInput
    );

    setUsers(users => {
      return users.map(user => {
        if (user.email === data.senderInput.label) {
          const newBalance = transactionType === 'Withdrawal' || transactionType === 'Transfer'
            ? user.accountBalance - data.transactionAmountInput
            : user.accountBalance + data.transactionAmountInput;

          return {
            ...user,
            accountBalance: newBalance,
            transactions: [...user.transactions, newTransaction]
          };
        } else if (receiver && user.email === data.receiverInput.label) {
          return {
            ...user,
            accountBalance: user.accountBalance + data.transactionAmountInput,
            transactions: [...user.transactions, newTransaction]
          };
        } else {
          return user;
        }
      });
    });

    toastSuccess(transactionToast(data.transactionAmountInput));
    customReset();
  }

  function transactionToast(transactionAmount) {
    if (transactionType === 'Withdrawal') {
      return `${formatMoney(transactionAmount)} withdrawn from ${sender}'s account!`
    } else if (transactionType === 'Deposit') {
      return `${formatMoney(transactionAmount)} deposited to ${sender}'s account.`
    } else if (transactionType === 'Transfer') {
      return `${formatMoney(transactionAmount)} transferred from ${sender}'s account to ${receiver}'s account!`
    }
  }

  return (
    <>
      <div className='w-full h-full flex flex-col justify-center items-center gap-10 overflow-y-auto'>
        <div className='border-none md:shadow-custom-transfer lg:shadow-custom-transfer p-10 md:p-14 lg:p-14 flex flex-col w-full md:w-[34rem] lg:w-[40rem]'>
          <h2 className='text-4xl md:text-5xl lg:text-5xl font-bold pt-[5.9rem] md:pt-0 lg:pt-0 pb-5 self-start'>Manage Funds</h2>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            <label className='flex flex-col'>
              <span className='text-lg font-[600]'>Transaction type</span>
              <div className='border-[2px] border-solid border-[#17171B]'>
                <Controller
                  control={control}
                  name='transactionTypeInput'
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder='Select a transaction type'
                      onChange={(selectedOption) => handleTransactionTypeChange(selectedOption, field.onChange)}
                      options={[
                        { value: 'Deposit', label: 'Deposit' },
                        { value: 'Withdrawal', label: 'Withdrawal' },
                        { value: 'Transfer', label: 'Transfer' }
                      ]}
                      styles={customDropdownStyles}
                      required={true}
                    />
                  )}
                />
              </div>
            </label>
            <label className='flex flex-col'>
              <span className='text-lg font-[600]'>Account</span>
              <div className='border-[2px] border-solid border-[#17171B]'>
                <Controller
                  control={control}
                  name='senderInput'
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder='Select an account'
                      onChange={(selectedOption) => handleSenderChange(selectedOption, field.onChange)}
                      options={users.map(({ firstName, lastName, email, userId, accountBalance }) => {
                        return { value: `${userId}`, label: `${email}`, accountBalance, firstName, lastName };
                      })}
                      styles={customDropdownStyles}
                      required={true}
                    />
                  )}
                />
                <div className={sender && senderBalanceStr ? 'flex flex-col items-end justify-center p-[0.5rem] h-[5rem] border-t-[2px] border-solid border-t-[#17171B] border-l-0 border-r-0 border-b-0 bg-[#b248fe] text-white font-[600] text-md md:text-lg lg:text-lg' : 'hidden'}>
                  <h3>{`${transactionType === 'Transfer' ? 'Sender' : 'Account'}: ${sender}`}</h3>
                  <h3>Balance: {senderBalanceStr}</h3>
                </div>
              </div>
            </label>
            {transactionType === 'Transfer' &&
              <label className='flex flex-col'>
                <span className='text-lg font-[600]'>Receiver</span>
                <div className='border-[2px] border-solid border-[#17171B]'>
                  <Controller
                    control={control}
                    name='receiverInput'
                    render={({ field }) => (
                      <Select
                        {...field}
                        placeholder='Select a receiver'
                        onChange={(selectedOption) => handleReceiverChange(selectedOption, field.onChange)}
                        options={users.filter(({ email }) => email !== senderEmail)
                          .map(({ firstName, lastName, email, userId, accountBalance }) => {
                            return { value: `${userId}`, label: `${email}`, accountBalance, firstName, lastName };
                          })}
                        required={true}
                        isDisabled={!senderConfirmed}
                      />
                    )}
                  />
                  <div className={receiver && receiverBalanceStr ? 'flex flex-col items-end justify-center p-[0.5rem] h-[5rem] border-t-[2px] border-solid border-t-[#17171B] border-l-0 border-r-0 border-b-0 bg-[#b248fe] text-white font-[600] text-md md:text-lg lg:text-lg' : 'hidden'}>
                    <h3>Receiver: {receiver}</h3>
                    <h3>Balance: {receiverBalanceStr}</h3>
                  </div>
                </div>
              </label>
            }
            <label>
              <span className='text-lg font-[600]'>Amount</span>
              <input {...register('transactionAmountInput')} className={inputClasses} type='text' placeholder='0.00' required={true} autoComplete='off' />
              {errors.transactionAmountInput && <p className='bg-[#17171B] text-white p-1 font-[500] italic'>{errors.transactionAmountInput.message}</p>}
            </label>
            <label>
              <span className='text-lg font-[600]'>Remarks</span>
              <textarea {...register('remarksInput')} className='w-full h-[5rem] p-2 border-2 border-solid border-[#17171B] p-[5px focus:outline-none focus:ring-0]' placeholder='Optional' autoComplete='off' />
            </label>
            <div className='flex justify-end gap-3'>
              <button onClick={() => customReset()} className='w-[35%] mt-6 p-[0.5rem] md:p-[0.6rem] lg:p-[0.7rem] text-md font-[800] hover:translate-y-[-2px] active:translate-y-[2px]'>Cancel</button>
              <button type='submit' className='w-[35%] bg-[#b248fe] mt-6 p-[0.5rem] md:p-[0.6rem] lg:p-[0.7rem] text-md font-[800] hover:translate-y-[-2px] active:translate-y-[2px]'>Submit</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
