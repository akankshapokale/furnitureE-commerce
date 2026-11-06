import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmDialog = ({ title, message, confirmLabel = "Delete", onCancel, onConfirm }: ConfirmDialogProps) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/40 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel(); }}>
    <section role="alertdialog" aria-modal="true" aria-labelledby="confirm-dialog-title" aria-describedby="confirm-dialog-message" className="w-full max-w-md border border-gray-200 bg-white p-5 shadow-xl sm:p-6">
      <div className="flex items-start gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-700"><AlertTriangle size={18} /></span><div><h2 id="confirm-dialog-title" className="text-base font-bold text-slate-900">{title}</h2><p id="confirm-dialog-message" className="mt-1 text-sm leading-5 text-slate-600">{message}</p></div></div>
      <div className="mt-5 flex justify-end gap-2"><button type="button" onClick={onCancel} className="border border-gray-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-gray-50">Cancel</button><button type="button" onClick={onConfirm} className="bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">{confirmLabel}</button></div>
    </section>
  </div>
);

export default ConfirmDialog;
