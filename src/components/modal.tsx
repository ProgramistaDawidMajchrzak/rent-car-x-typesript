import React, {useState} from 'react';
import ReactModal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { confirmEmail } from '../services/auth.service';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

type CustomModalProps = {
  isOpen: boolean;
  onRequestClose: () => void;
  confirmUrl: string;
};

export const CustomModal: React.FC<CustomModalProps> = ({ isOpen, onRequestClose, confirmUrl }) => {
  const navigate = useNavigate();
  const [confirmMessage, setConfirmMessage] = useState(null);

    const onSubmit = async () => {
        try {
            const response = await confirmEmail(confirmUrl);
            setConfirmMessage(response)
        } catch (err) {
            alert('Confirmation failed. Check console for details.');
            console.error(err);
        }
    }
    

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Confirmation Modal"
      ariaHideApp={false}
    >
        <button
            onClick={onRequestClose}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded shadow"
        >
        Close
        </button>

        <div className="my-5 text-sm text-gray-700 font-medium">
            Click below to confirm your email:
        </div>

        <button
            onClick={onSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow mb-4"
        >
        Confirm Email
        </button>

        {confirmMessage && (
            <p className="text-green-500 text-xs font-medium">{confirmMessage}</p>
        )}

        <button
            onClick={() => navigate('/login')}
            className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded shadow mt-5"
        >
        Go to Login Page
        </button>

    </ReactModal>
  );
};
