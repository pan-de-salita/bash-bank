import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { useState, useEffect } from 'react';

export default function CreateUserTable({ currentUsers }) {

  return (
    <>
      <Table className='w-full border-[0.4rem] border-solid border-[#17171B] md:shadow-custom-add-user lg:shadow-custom-add-user'>
        <Thead >
          <Tr>
            <Th className='p-3 text-lg'>First name</Th>
            <Th className='p-3 text-lg'>Last name</Th>
            <Th className='p-3 text-lg'>Email</Th>
            <Th className='p-3 text-lg'>User ID</Th>
            <Th className='p-3 text-lg'>Account Balance</Th>
          </Tr>
        </Thead>
        {currentUsers.map((user, idx) => {
          return (
            <Tr className={`${idx % 2 === 0 ? 'bg-[#b248fe70]' : 'bg-white'} text-center p-3`}>
              <Td className='p-2'>{user.firstName.slice(0, 8)}</Td>
              <Td className='p-2'>{user.lastName}</Td>
              <Td className='p-2'>{user.email}</Td>
              <Td className='p-2'>{user.userId}</Td>
              <Td className='p-2'>{user.accountBalance}</Td>
            </Tr>
          )
        })}
      </Table>
    </>
  )
}
