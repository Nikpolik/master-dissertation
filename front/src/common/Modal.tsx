import { MouseEvent, useRef } from 'react';

interface ModalProps {
  open: boolean;
  children?: any;
  onClose?: () => void;
}

export default function Modal({ open, children, onClose }: ModalProps) {
  const ref = useRef(null);
  function handleClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === ref.current && onClose) {
      onClose();
    }
  }
  return (
    <div
      onClick={handleClick}
      ref={ref}
      style={{
        zIndex: 1000,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: 'absolute',
        background: 'rgba(0, 0, 0, 0.3)',
        display: open ? 'block' : 'none',
      }}
    >
      {children}
    </div>
  );
}
