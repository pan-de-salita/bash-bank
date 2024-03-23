import ManageFundsTable from '../components/ManageFundsTable';
import CreateUserTable from '../components/CreateUserTable';
import useLocalStorage from '../utils/useLocalStorage';

export default function Overview() {
  const [users, setUsers] = useLocalStorage('users', []);

  return (
    <>
      <div className='flex flex-col gap-10 w-full md:w-full lg:w-full p-8 md:p-4 lg:p-[10rem]'>
        <div className='flex flex-col gap-[3rem]'>
          <h1 className='font-[600]'>Transactions</h1>
          <ManageFundsTable currentUsers={users} />
        </div>
        <div className='flex flex-col gap-[3rem]'>
          <h1 className='font-[600]'>Members</h1>
          <CreateUserTable currentUsers={users} />
        </div>
      </div>
    </>
  )
}
