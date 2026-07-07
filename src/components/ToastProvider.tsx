"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type ToastType = "success" | "error" | "info";

type Toast = {
    id: number;
    message: string;
    type: ToastType;
};

type ToastContextValue = {
    showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: number) => {
        setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: ToastType = "info") => {
        const id = Date.now();
        setToasts((currentToasts) => [...currentToasts, { id, message, type }]);

        window.setTimeout(() => {
            removeToast(id);
        }, 3800);
    }, [removeToast]);

    const value = useMemo(() => ({ showToast }), [showToast]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="fixed right-4 top-4 z-[200] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`rounded-2xl border px-4 py-3 text-sm font-medium text-white shadow-2xl backdrop-blur-2xl ${getToastClass(toast.type)}`}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <p className="leading-5">{toast.message}</p>
                            <button
                                type="button"
                                onClick={() => removeToast(toast.id)}
                                className="rounded-full px-1 text-white/70 transition hover:bg-white/10 hover:text-white"
                                aria-label="Dismiss notification"
                            >
                                x
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error("useToast must be used inside ToastProvider");
    }

    return context;
}

function getToastClass(type: ToastType) {
    if (type === "success") {
        return "border-emerald-300/20 bg-emerald-500/20 shadow-emerald-950/30";
    }

    if (type === "error") {
        return "border-rose-300/20 bg-rose-500/20 shadow-rose-950/30";
    }

    return "border-cyan-300/20 bg-slate-900/75 shadow-slate-950/30";
}
