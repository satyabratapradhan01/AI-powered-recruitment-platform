import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle, Info, Trash2 } from 'lucide-react';

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  description = 'Are you sure you want to proceed with this action?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
}) => {
  const icons = {
    danger: <Trash2 className="w-6 h-6 text-rose-600 shrink-0" />,
    warning: <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />,
    primary: <Info className="w-6 h-6 text-indigo-600 shrink-0" />,
  };

  const iconBg = {
    danger: 'bg-rose-100',
    warning: 'bg-amber-100',
    primary: 'bg-indigo-100',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      closeOnOutsideClick={!isLoading}
    >
      <div className="flex flex-col items-center text-center pt-2">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${iconBg[variant] || iconBg.danger}`}
        >
          {icons[variant] || icons.danger}
        </div>
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h3>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">{description}</p>

        <div className="flex items-center justify-center gap-3 w-full mt-6">
          <Button
            variant="outline"
            size="md"
            fullWidth
            onClick={onClose}
            isDisabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'warning' ? 'primary' : variant}
            size="md"
            fullWidth
            isLoading={isLoading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationDialog;
