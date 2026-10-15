import React from 'react';
import { Button } from '../ui/Button';
import { AlertCircle, X } from 'lucide-react';

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger" // 'danger', 'primary'
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E2EAF5] space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-2xl bg-[#FFE8E5] text-[#D93829] flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <button 
            onClick={onClose}
            className="text-[#687793] hover:text-[#15264B] p-1 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 className="text-lg font-bold text-[#15264B]">{title}</h3>
          <p className="text-sm text-[#687793] mt-1.5 leading-relaxed">{description}</p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3">
          <Button variant="secondary" size="md" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button 
            variant={variant === 'danger' ? 'danger' : 'primary'} 
            size="md" 
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
