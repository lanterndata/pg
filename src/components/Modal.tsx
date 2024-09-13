import classNames from 'classnames';
import React, { useRef, useEffect } from 'react';
import { HiXMark } from 'react-icons/hi2';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'md' | 'lg' | 'xl' | '2xl';
}

function Modal({ isOpen, onClose, title, children, size }: ModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (modalRef.current && !modalRef.current.contains(target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const maxWidthClass =
    {
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl',
    }[size || '2xl'] || 'max-w-2xl';

  return (
    <>
      <div className='fixed w-screen h-screen top-0 left-0 z-40 bg-black opacity-50' />

      <div className='fixed inset-0 z-50 flex items-center justify-center left-0 text-slate-700'>
        <div
          ref={modalRef}
          className={classNames(
            'z-10 inset-0 p-8 bg-white rounded w-full relative max-h-[calc(100vh-64px)] overflow-y-auto',
            maxWidthClass
          )}
        >
          <HiXMark
            className='absolute top-4 right-4 w-5 h-5 cursor-pointer'
            onClick={onClose}
          />
          {title && <h1 className='mb-6 text-lg font-medium'>{title}</h1>}
          {children}
        </div>
      </div>
    </>
  );
}

export default Modal;
