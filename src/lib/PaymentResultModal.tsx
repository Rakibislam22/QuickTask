import { CheckIcon, CloseIcon } from "./Icons";

type PaymentResultModalProps = {
    result: "success" | "cancel";
    isUpgrading: boolean;
    onClose: () => void;
    onUpgrade: () => void;
};

export function PaymentResultModal({ result, isUpgrading, onClose, onUpgrade }: PaymentResultModalProps) {
    const isSuccess = result === "success";

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/75 px-4 py-6 backdrop-blur-md">
            <div className="w-[95%] max-w-md rounded-3xl border border-white/15 bg-slate-900/50 p-6 text-center text-white shadow-2xl backdrop-blur-2xl">
                <div
                    className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ring-1 ${isSuccess
                        ? "bg-emerald-400/15 text-emerald-200 shadow-[0_0_28px_rgba(52,211,153,0.24)] ring-emerald-300/20"
                        : "bg-rose-400/15 text-rose-200 shadow-[0_0_28px_rgba(251,113,133,0.18)] ring-rose-300/20"
                        }`}
                >
                    {isSuccess ? <CheckIcon /> : <CloseIcon />}
                </div>
                <h2 className="mt-5 text-xl font-semibold">
                    {isSuccess ? "Payment successful" : "Payment canceled"}
                </h2>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-300">
                    {isSuccess
                        ? "Premium is active now. You can add unlimited tasks without logging out."
                        : "Your payment was canceled. You can try upgrading again anytime."}
                </p>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full px-5 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                    >
                        {isSuccess ? "Done" : "Close"}
                    </button>
                    {!isSuccess && (
                        <button
                            type="button"
                            onClick={onUpgrade}
                            disabled={isUpgrading}
                            className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_22px_rgba(34,211,238,0.28)] transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(34,211,238,0.42)] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isUpgrading ? "Opening Checkout..." : "Try Again"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}