import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = true
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="flex items-start gap-4 mb-6">
        <div className={`p-2.5 rounded-full shrink-0 ${isDestructive ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-700'}`}>
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm text-stone-600 leading-relaxed">
            {message}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors cursor-pointer ${
            isDestructive
              ? 'bg-amber-800 hover:bg-amber-900 shadow-xs'
              : 'bg-stone-800 hover:bg-stone-900'
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
};
