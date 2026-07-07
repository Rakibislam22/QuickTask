import type { Task } from "@/lib/utils";
import { TrashIcon } from "./Icons";

type DeleteConfirmationModalProps = {
    task: Task;
    isDeleting: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

export function DeleteConfirmationModal({ task, isDeleting, onClose, onConfirm }: DeleteConfirmationModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-md">
            <div className="max-h-[90vh] w-[95%] max-w-lg overflow-y-auto rounded-3xl border border-white/15 bg-slate-900/40 p-5 text-white shadow-2xl backdrop-blur-2xl sm:w-full sm:p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-400/15 text-rose-200 shadow-[0_0_24px_rgba(251,113,133,0.22)] ring-1 ring-rose-300/20">
                            <TrashIcon />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">Delete Task</h2>
                            <p className="mt-1 text-sm text-slate-300">Are you sure you want to delete this task?</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                        aria-label="Close delete confirmation"
                    >
                        x
                    </button>
                </div>
                <div className="mt-4 rounded-xl bg-white/5 p-4">
                    <p className="truncate text-sm font-semibold text-white">{task.title}</p>
                    <p className="mt-1 truncate text-xs text-slate-400">{task.description}</p>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="rounded-full px-5 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/10 hover:text-white">
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="rounded-full bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isDeleting ? "Deleting..." : "Yes, Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}