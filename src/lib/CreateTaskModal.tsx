import type { FormEvent } from "react";
import type { CreateTaskForm } from "@/lib/utils";
import { PlusIcon } from "./Icons";

type CreateTaskModalProps = {
    createForm: CreateTaskForm;
    hasReachedLimit: boolean;
    isCreating: boolean;
    isUpgrading: boolean;
    onChange: (field: keyof CreateTaskForm, value: string) => void;
    onClose: () => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    onUpgrade: () => void;
};

export function CreateTaskModal({
    createForm,
    hasReachedLimit,
    isCreating,
    isUpgrading,
    onChange,
    onClose,
    onSubmit,
    onUpgrade,
}: CreateTaskModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-md">
            <div className="max-h-[90vh] w-[95%] max-w-lg overflow-y-auto rounded-3xl border border-white/15 bg-slate-900/40 p-5 text-white shadow-2xl backdrop-blur-2xl sm:w-full sm:p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-200 shadow-[0_0_24px_rgba(34,211,238,0.22)] ring-1 ring-cyan-300/20">
                            <PlusIcon />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">Add New Task</h2>
                            <p className="mt-1 text-sm text-slate-300">Create a focused card for your board.</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                        aria-label="Close task modal"
                    >
                        x
                    </button>
                </div>

                {hasReachedLimit ? (
                    <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 px-5 py-8 text-center backdrop-blur-xl">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-200 shadow-[0_0_28px_rgba(34,211,238,0.22)] ring-1 ring-cyan-300/20">
                            <PlusIcon />
                        </div>
                        <p className="mx-auto mt-5 max-w-sm text-sm leading-6 text-slate-200">
                            You have reached your free task limit (3/3). Upgrade to Premium to add unlimited tasks.
                        </p>
                        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-full px-5 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={onUpgrade}
                                disabled={isUpgrading}
                                className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_22px_rgba(34,211,238,0.28)] transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(34,211,238,0.42)] disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isUpgrading ? "Opening Checkout..." : "Upgrade to Premium"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={onSubmit} className="mt-6 space-y-4">
                        <label className="block">
                            <span className="text-sm font-medium text-slate-200">Title</span>
                            <input
                                value={createForm.title}
                                onChange={(event) => onChange("title", event.target.value)}
                                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none backdrop-blur-md transition-colors placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/50"
                                placeholder="Task title"
                                autoFocus
                            />
                        </label>
                        <label className="block">
                            <span className="text-sm font-medium text-slate-200">Description</span>
                            <textarea
                                value={createForm.description}
                                onChange={(event) => onChange("description", event.target.value)}
                                className="mt-2 min-h-32 w-full resize-none rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm leading-6 text-white outline-none backdrop-blur-md transition-colors placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/50"
                                placeholder="Describe the task"
                            />
                        </label>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-full px-5 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isCreating}
                                className="rounded-full bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isCreating ? "Creating..." : "Create Task"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}