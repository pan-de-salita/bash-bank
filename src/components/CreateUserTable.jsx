import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { useState, useEffect } from 'react';

export default function ManageFundsTable({ currentUsers }) {
  const [currentTransactions, setCurrentTransactions] = useState([]);

  useEffect(() => {
    const allUsers = currentUsers.reduce((acc, { transactions }) => {
      return [...acc, ...transactions.filter(transaction => !acc.some(t => t.transactionId === transaction.transactionId))];
    }, []);

    setCurrentTransactions(allUsers);
  }, [currentUsers]);

  return (
    <>
      <Table className='w-full border-[0.4rem] border-solid border-[#17171B] shadow-custom-add-user'>
        <Thead >
          <Tr>
            <Th className='p-3 text-lg'>First name</Th>
            <Th className='p-3 text-lg'>Last name</Th>
            <Th className='p-3 text-lg'>Email</Th>
            <Th className='p-3 text-lg'>Password</Th>
            <Th className='p-3 text-lg'>User ID</Th>
            <Th className='p-3 text-lg'>Account Balance</Th>
          </Tr>
        </Thead>
        {currentTransactions.map((transaction, idx) => {
          return (
            <Tr className={`${idx % 2 === 0 ? 'bg-[#b248fe70]' : 'bg-white'} text-center p-3`}>
              <Td className='p-2'>{transaction.transactionId.slice(0, 8)}</Td>
              <Td className='p-2'>{transaction.transactionType}</Td>
              <Td className='p-2'>{transaction.transactionAmount}</Td>
              <Td className='p-2'>{transaction.sender}</Td>
              <Td className='p-2'>{transaction.receiver}</Td>
              <Td className='p-2'>{transaction.time}</Td>
            </Tr>
          )
        })}
      </Table>
    </>
  )
}
