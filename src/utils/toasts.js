import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export function toastSuccess(msg) {
	return toast.success(msg, {
		position: "bottom-right",
		autoClose: 3000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "colored",
		style: {
			background: '#b248fe',
			color: 'white',
		},
	});
}

export function toastError(msg) {
	return toast.success(msg, {
		position: "bottom-right",
		autoClose: 3000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "colored",
		style: {
			background: '#17171B',
			color: 'white',
		},
	});

}
