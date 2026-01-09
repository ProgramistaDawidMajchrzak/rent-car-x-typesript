import React from 'react';
import ReactModal from 'react-modal';

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

export const CustomModal: React.FC<CustomModalProps> = ({ isOpen, onRequestClose }) => {

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Confirmation Modal"
      ariaHideApp={false}
    >
      <div className="flex flex-col items-center gap-4 p-4">

        <h2 className="text-lg font-bold">Verify your email</h2>

        <p className="text-sm text-gray-700 text-center max-w-[260px]">
          Your account has been created successfully.
          <br />
          <strong>Please check your email inbox</strong> and click the activation link to confirm your account.
        </p>

        <button
          onClick={onRequestClose}
          className="bg-slate-900 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded shadow"
        >
          Close
        </button>

      </div>
    </ReactModal>
  );
};
