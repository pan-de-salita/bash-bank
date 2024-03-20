import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function Toast({ toastType, toastText, textColor, bgColor }) {
  const toastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    style: {
      background: bgColor,
      color: textColor,
    },
  };

  toast[toastType](toastText, toastOptions);

  return (
    <ToastContainer />
  );
}
