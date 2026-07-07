export function SkeletonCard() {
    return (
        <div className="animate-pulse rounded-2xl border border-white/10 bg-white/7 p-5 backdrop-blur-md">
            <div className="flex items-start justify-between gap-3">
                <div className="space-y-3">
                    <div className="h-5 w-20 rounded-full bg-white/10" />
                    <div className="h-5 w-36 rounded bg-white/10" />
                </div>
                <div className="h-6 w-10 rounded-full bg-white/10" />
            </div>
            <div className="mt-4 space-y-2">
                <div className="h-3 w-full rounded bg-white/10" />
                <div className="h-3 w-5/6 rounded bg-white/10" />
            </div>
            <div className="mt-5 flex items-center justify-between">
                <div className="h-7 w-16 rounded-lg bg-white/10" />
                <div className="h-9 w-9 rounded-full bg-white/10" />
            </div>
        </div>
    );
}