import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

const ErrorModal = ({ error, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(false);
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => {
        setIsOpen(false);
        onClose();
      }}
      contentLabel="Error Modal"
      style={{
        overlay: {
          backgroundColor: 'rgba(255, 0, 0, 0.5)',
          zIndex: 1000, // Задайте більше значення, якщо потрібно
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '500px',
          height: '300px',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        },
        content: {
          color: 'black',
          textAlign: 'center',
        },
      }}
    >
      <h2>Error</h2>
      <p>{error}</p>
    </Modal>
  );
};

export default ErrorModal;
