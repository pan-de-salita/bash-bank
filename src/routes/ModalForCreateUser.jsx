import { AiOutlineAlert } from "react-icons/ai";

export default function ModalForCreateUser({ visibility, onClose }) {
  return (
    <>
      {
        visibility
        && <div className='absolute inset-0 flex bg-[#17171B] bg-opacity-70 justify-center items-center'>
          <div className='flex flex-col gap-1 justify-between items-center bg-[#17171B] rounded-3xl pt-10 h-[20rem] md:h-[22rem] lg:h-[22rem] w-[23rem] md:w-[30rem] lg:w-[30rem] shadow-2xl'>
            <AiOutlineAlert className='' size={80} color='white' />
            <h2 className='text-white text-4xl font-bold p-3 pl-10 pr-10'>Oops!</h2>
            <p className='text-white w-[85%] text-md text-center pl-10 pr-10'>A user with that email address already exists. Maybe try using a different email?</p>
            <div className='pt-8 flex w-full'>
              <button className='h-[3.5rem] bg-[#17171B] border-t-2 border-solid border-t-[#b248fe] rounded-bl-3xl rounded-br-3xl text-[#b248fe] w-full text-xl font-bold
              hover:bg-[#b248fe] hover:text-[#17171B]' onClick={onClose}>OK</button>
            </div>
          </div>
        </div>
      }
    </>
  );
}
