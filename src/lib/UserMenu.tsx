import type { UserValue } from "@/lib/utils";

type UserMenuProps = {
    avatarInitials: string;
    displayEmail: string;
    displayName: string;
    isOpen: boolean;
    isPremium: boolean;
    menuRef: React.RefObject<HTMLDivElement | null>;
    onLogout: () => void;
    onToggle: () => void;
};

export function UserMenu({ avatarInitials, displayEmail, displayName, isOpen, isPremium, menuRef, onLogout, onToggle }: UserMenuProps) {
    return (
        <div ref={menuRef} className="relative flex w-full justify-end sm:justify-center lg:w-auto lg:shrink-0">
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={isOpen}
                aria-label="Open user menu"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-cyan-400/15 text-sm font-semibold text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.14)] ring-1 ring-cyan-400/20 transition-all hover:scale-105 hover:bg-cyan-400/20"
            >
                {avatarInitials}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-14 z-[100] w-[min(18rem,calc(100vw-2rem))] rounded-3xl border border-white/15 bg-slate-900/80 p-4 text-left shadow-2xl shadow-black/30 backdrop-blur-2xl sm:right-1/2 sm:translate-x-1/2 lg:right-0 lg:translate-x-0">
                    <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cyan-400/15 text-sm font-bold text-cyan-100 ring-1 ring-cyan-400/20">
                            {avatarInitials}
                        </div>
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <p className="max-w-44 truncate text-lg font-semibold text-white">{displayName}</p>
                                {isPremium && (
                                    <span className="rounded-full border border-emerald-300/20 bg-emerald-400/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-200">
                                        Premium
                                    </span>
                                )}
                            </div>
                            <p className="mt-1 max-w-52 truncate text-sm text-slate-400">{displayEmail}</p>
                        </div>
                    </div>

                    <div className="mt-4 border-t border-white/10 pt-3">
                        <button
                            type="button"
                            onClick={onLogout}
                            className="w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold text-rose-300 transition-colors hover:bg-rose-500/10"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}