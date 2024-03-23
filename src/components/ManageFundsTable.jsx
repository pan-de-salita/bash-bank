import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { useState, useEffect } from 'react';

export default function ManageFundsTable({ currentUsers }) {
  const [currentTransactions, setCurrentTransactions] = useState([]);

  useEffect(() => {
    const uniqueTransactions = currentUsers.reduce((acc, { transactions }) => {
      return [...acc, ...transactions.filter(transaction => !acc.some(t => t.transactionId === transaction.transactionId))];
    }, []);

    setCurrentTransactions(uniqueTransactions);
  }, [currentUsers]);

  return (
    <>
      <Table className='w-full border-[0.4rem] border-solid border-[#17171B] shadow-custom-add-user'>
        <Thead >
          <Tr>
            <Th className='p-3 text-lg'>Transaction ID</Th>
            <Th className='p-3 text-lg'>Type</Th>
            <Th className='p-3 text-lg'>Amount</Th>
            <Th className='p-3 text-lg'>Sender</Th>
            <Th className='p-3 text-lg'>Receiver</Th>
            <Th className='p-3 text-lg'>Time</Th>
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
