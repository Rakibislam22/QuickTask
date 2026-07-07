"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";
import { CreateTaskModal } from "@/lib/CreateTaskModal";
import { DeleteConfirmationModal } from "@/lib/DeleteConfirmationModal";
import { ArrowRightIcon, TrashIcon } from "@/lib/Icons";
import { PaymentResultModal } from "@/lib/PaymentResultModal";
import { SkeletonCard } from "@/lib/SkeletonCard";
import { UserMenu } from "@/lib/UserMenu";
import { loadStripe } from "@stripe/stripe-js";
import api from "@/lib/axios";
import {
    extractTaskFromResponse,
    getAssigneeInitials,
    getNextStatus,
    getTagClass,
    getTaskTags,
    getUserDisplayName,
    getUserInitials,
    isFreeTierLimitError,
    isUnauthorizedError,
    normalizeStatus,
    performLogout,
    resolveStoredUser,
    type CreateTaskForm,
    type Task,
    type UserValue,
} from "@/lib/utils";

type StripeCheckoutClient = {
    redirectToCheckout: (options: { sessionId: string }) => Promise<{ error?: { message?: string } }>;
};

const laneConfigs = [
    {
        title: "To Do",
        key: "todo",
        laneClass: "bg-cyan-500/5",
        dotClass: "bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.8)]",
        countClass: "bg-cyan-500/20 text-cyan-300",
        hoverShadow: "hover:shadow-cyan-500/10",
    },
    {
        title: "In Progress",
        key: "inprogress",
        laneClass: "bg-blue-500/5",
        dotClass: "bg-blue-400 shadow-[0_0_18px_rgba(59,130,246,0.8)]",
        countClass: "bg-blue-500/20 text-blue-300",
        hoverShadow: "hover:shadow-blue-500/10",
    },
    {
        title: "Done",
        key: "done",
        laneClass: "bg-emerald-500/5",
        dotClass: "bg-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.8)]",
        countClass: "bg-emerald-500/20 text-emerald-300",
        hoverShadow: "hover:shadow-emerald-500/10",
    },
] as const;

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : Promise.resolve(null);

export default function DashboardPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [isPremium, setIsPremium] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [user, setUser] = useState<UserValue>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createForm, setCreateForm] = useState<CreateTaskForm>({ title: "", description: "" });
    const [isCreating, setIsCreating] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [movingTaskId, setMovingTaskId] = useState<string | number | null>(null);
    const [deletingTaskId, setDeletingTaskId] = useState<string | number | null>(null);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [paymentModal, setPaymentModal] = useState<"success" | "cancel" | null>(null);
    const mobileUserMenuRef = useRef<HTMLDivElement>(null);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
    const desktopUserMenuRef = useRef<HTMLDivElement>(null);

    const hasReachedLimit = !isPremium && tasks.length >= 3;
    const displayName = getUserDisplayName(user);
    const avatarInitials = getUserInitials(user);
    const displayEmail = getUserEmail(user);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                router.replace("/login");
                return;
            }

            const storedName = localStorage.getItem("name");
            const storedUser = localStorage.getItem("user");
            const resolvedUser = resolveStoredUser(storedUser, storedName, token);
            setUser(resolvedUser);

            const syncLocalPremiumStatus = () => {
                setIsPremium(resolvePremiumStatusFromStorage());
            };

            const searchParams = new URLSearchParams(window.location.search);
            const paymentSucceeded = searchParams.get("success") === "true";
            const paymentCanceled = searchParams.get("canceled") === "true" || searchParams.get("cancel") === "true";
            syncLocalPremiumStatus();

            if (paymentSucceeded) {
                const premiumUser = markStoredUserAsPremium(resolvedUser);
                setUser(premiumUser);
                setIsPremium(true);
                setPaymentModal("success");
                router.replace("/dashboard");
            }

            if (paymentCanceled) {
                setPaymentModal("cancel");
                router.replace("/dashboard");
            }

            try {
                setIsLoading(true);
                const tasksResponse = await api.get("/tasks");
                const responseData = tasksResponse.data as { tasks?: Task[]; data?: Task[] } | Task[];
                const fetchedTasks = Array.isArray(responseData)
                    ? responseData
                    : responseData.tasks ?? responseData.data ?? [];

                setTasks(fetchedTasks);
                syncLocalPremiumStatus();
            } catch (error) {
                if (isUnauthorizedError(error)) {
                    performLogout(router);
                    return;
                }

                setTasks([]);
                setMessage("Unable to load tasks. Please try again.");
                console.error("Failed to fetch tasks:", error);
            } finally {
                setIsLoading(false);
            }
        };

        void fetchDashboardData();
    }, [router]);

    useEffect(() => {
        if (!isUserMenuOpen) {
            return;
        }

        const handlePointerDown = (event: PointerEvent) => {
            const target = event.target as Node;
            const clickedMobileMenu = mobileUserMenuRef.current?.contains(target);
            const clickedDesktopMenu = desktopUserMenuRef.current?.contains(target);

            if (!clickedMobileMenu && !clickedDesktopMenu) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener("pointerdown", handlePointerDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
        };
    }, [isUserMenuOpen]);

    const handleCreateTask = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (hasReachedLimit) {
            setMessage("Free tier limit reached. Please upgrade.");
            setIsCreateModalOpen(false);
            return;
        }

        const title = createForm.title.trim();
        const description = createForm.description.trim();

        if (!title) {
            setMessage("Please add a task title.");
            return;
        }

        try {
            setIsCreating(true);
            setMessage(null);
            const response = await api.post("/tasks", { title, description });
            const createdTask = extractTaskFromResponse(response.data) ?? {
                id: Date.now(),
                title,
                description,
                status: "To Do",
            };

            setTasks((currentTasks) => [createdTask, ...currentTasks]);
            setCreateForm({ title: "", description: "" });
            setIsCreateModalOpen(false);
            showToast("Task created successfully!", "success");
        } catch (error) {
            if (isUnauthorizedError(error)) {
                performLogout(router);
                return;
            }

            const errorMessage = isFreeTierLimitError(error)
                ? "Free tier limit reached. Please upgrade."
                : "Unable to create task. Please try again.";
            setMessage(errorMessage);
            showToast(errorMessage, "error");
            console.error("Failed to create task:", error);
        } finally {
            setIsCreating(false);
        }
    };

    const handleMoveTask = async (task: Task) => {
        const taskId = task.id;

        if (taskId === undefined) {
            setMessage("Unable to move this task.");
            return;
        }

        const previousStatus = task.status;
        const nextStatus = getNextStatus(task.status);

        setMovingTaskId(taskId);
        setMessage(null);
        setTasks((currentTasks) =>
            currentTasks.map((currentTask) =>
                currentTask.id === taskId ? { ...currentTask, status: nextStatus } : currentTask
            )
        );

        try {
            await api.patch(`/tasks/${taskId}`, { status: nextStatus });
        } catch (error) {
            setTasks((currentTasks) =>
                currentTasks.map((currentTask) =>
                    currentTask.id === taskId ? { ...currentTask, status: previousStatus } : currentTask
                )
            );

            if (isUnauthorizedError(error)) {
                performLogout(router);
                return;
            }

            setMessage("Unable to update task status. Please try again.");
            console.error("Failed to update task status:", error);
        } finally {
            setMovingTaskId(null);
        }
    };

    const handleDeleteTask = async () => {
        if (!taskToDelete) {
            return;
        }

        const taskIdToDelete = taskToDelete.id;

        if (taskIdToDelete === undefined) {
            setMessage("Unable to delete this task.");
            return;
        }

        const previousTasks = tasks;
        setDeletingTaskId(taskIdToDelete);
        setMessage(null);
        setTasks((currentTasks) => currentTasks.filter((currentTask) => currentTask.id !== taskIdToDelete));

        try {
            await api.delete(`/tasks/${taskIdToDelete}`);
            setTaskToDelete(null);
            showToast("Task deleted successfully.", "success");
        } catch (error) {
            setTasks(previousTasks);

            if (isUnauthorizedError(error)) {
                performLogout(router);
                return;
            }
            const errorMessage = "Unable to delete task. Please try again.";
            setMessage(errorMessage);
            showToast(errorMessage, "error");
            console.error("Failed to delete task:", error);
        } finally {
            setDeletingTaskId(null);
        }
    };

    const handleUpgrade = async () => {
        try {
            setIsUpgrading(true);
            setMessage(null);

            const stripe = await stripePromise;

            if (!stripe) {
                setMessage("Stripe is not configured yet. Please try again later.");
                return;
            }

            const response = await api.post("/payment/create-checkout-session");
            const checkoutUrl = getCheckoutUrl(response.data);

            if (checkoutUrl) {
                window.location.assign(checkoutUrl);
                return;
            }

            const sessionId = getCheckoutSessionId(response.data);

            if (!sessionId) {
                console.error("Checkout session response did not include a sessionId or url:", response.data);
                setMessage("Unable to start checkout. Please try again.");
                return;
            }

            const checkoutStripe = stripe as unknown as StripeCheckoutClient;
            if (typeof checkoutStripe.redirectToCheckout !== "function") {
                console.error("Stripe redirectToCheckout is unavailable on the loaded Stripe client.");
                setMessage("Stripe Checkout is not available. Please try again later.");
                return;
            }

            const result = await checkoutStripe.redirectToCheckout({ sessionId });

            if (result.error) {
                setMessage(result.error.message ?? "Unable to redirect to checkout. Please try again.");
            }
        } catch (error) {
            if (isUnauthorizedError(error)) {
                performLogout(router);
                return;
            }

            setMessage("Unable to start checkout. Please try again.");
            console.error("Failed to create checkout session:", error);
        } finally {
            setIsUpgrading(false);
        }
    };

    const openCreateModal = () => {
        setMessage(null);
        setIsCreateModalOpen(true);
    };

    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.2),transparent_34%),linear-gradient(135deg,#0f172a_0%,#111827_55%,#0b1120_100%)] text-white selection:bg-cyan-500/30">
            <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-8 lg:px-8">
                <header className="relative z-20 mb-8 flex flex-col gap-4 rounded-3xl border border-white/20 bg-white/5 px-4 py-4 shadow-xl backdrop-blur-2xl sm:mb-10 sm:px-6 lg:mb-12 lg:flex-row lg:items-center lg:justify-between lg:rounded-full lg:px-8">
                    <div className="flex w-full items-center justify-between gap-4 lg:w-auto">
                        <div className="min-w-0 text-left">
                            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-[1.7rem]">Dashboard</h1>
                            <p className="hidden text-sm leading-6 tracking-tight text-slate-400 sm:block sm:text-[0.95rem]">Manage your tasks and boost productivity.</p>
                        </div>
                        <div className="lg:hidden">
                            <UserMenu
                                avatarInitials={avatarInitials}
                                displayEmail={displayEmail}
                                displayName={displayName}
                                isOpen={isUserMenuOpen}
                                isPremium={isPremium}
                                menuRef={mobileUserMenuRef}
                                onLogout={() => performLogout(router)}
                                onToggle={() => setIsUserMenuOpen((isOpen) => !isOpen)}
                            />
                        </div>
                    </div>

                    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:w-auto lg:items-center lg:justify-end">
                        {!isPremium && (
                            <button
                                type="button"
                                onClick={() => void handleUpgrade()}
                                disabled={isUpgrading}
                                className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_12px_rgba(34,211,238,0.18)] transition-colors hover:from-cyan-400 hover:to-blue-400 disabled:cursor-not-allowed disabled:opacity-70 lg:w-auto lg:shrink-0"
                            >
                                {isUpgrading ? "Opening Checkout..." : "Unlock Unlimited ($5)"}
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={openCreateModal}
                            className="w-full rounded-full bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-none transition-colors hover:bg-cyan-400 hover:shadow-none lg:w-auto lg:shrink-0"
                        >
                            Add New Task
                        </button>
                        <div className="hidden lg:block">
                            <UserMenu
                                avatarInitials={avatarInitials}
                                displayEmail={displayEmail}
                                displayName={displayName}
                                isOpen={isUserMenuOpen}
                                isPremium={isPremium}
                                menuRef={desktopUserMenuRef}
                                onLogout={() => performLogout(router)}
                                onToggle={() => setIsUserMenuOpen((isOpen) => !isOpen)}
                            />
                        </div>
                    </div>
                </header>

                {message && (
                    <div className="mb-6 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium text-cyan-100 shadow-2xl backdrop-blur-xl">
                        {message}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-3">
                    {laneConfigs.map((lane) => {
                        const laneTasks = tasks.filter((task) => normalizeStatus(task.status) === lane.key);

                        return (
                            <section
                                key={lane.title}
                                className={`${lane.laneClass} flex flex-col gap-4 rounded-3xl border border-white/10 p-4 backdrop-blur-xl sm:p-5`}
                            >
                                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md">
                                    <div className="flex items-center gap-3">
                                        <span className={`h-2.5 w-2.5 rounded-full ${lane.dotClass}`} />
                                        <h2 className="font-semibold text-slate-100">{lane.title}</h2>
                                    </div>
                                    <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${lane.countClass}`}>
                                        {laneTasks.length}
                                    </span>
                                </div>

                                {isLoading ? (
                                    <div className="space-y-4">
                                        <SkeletonCard />
                                        <SkeletonCard />
                                    </div>
                                ) : laneTasks.length > 0 ? (
                                    laneTasks.map((task, index) => {
                                        const tags = getTaskTags(task);
                                        const priorityLabel = task.priority?.trim() || `P${Math.min(index + 1, 3)}`;
                                        const assigneeInitials = getAssigneeInitials(task, displayName, avatarInitials);

                                        return (
                                            <article
                                                key={task.id ?? `${lane.title}-${index}`}
                                                className={`group w-full rounded-2xl border border-white/10 bg-white/7 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:shadow-xl sm:p-5 ${lane.hoverShadow}`}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {tags.length > 0 ? (
                                                                tags.slice(0, 2).map((tag) => (
                                                                    <span
                                                                        key={tag}
                                                                        className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold sm:text-[11px] ${getTagClass(tag)}`}
                                                                    >
                                                                        {tag}
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-semibold text-cyan-200 sm:text-[11px]">
                                                                    Task
                                                                </span>
                                                            )}
                                                        </div>
                                                        <h3 className="mt-3 text-sm font-semibold text-white sm:text-base">
                                                            {task.title ?? "Untitled task"}
                                                        </h3>
                                                    </div>
                                                    <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-slate-300 sm:text-[11px]">
                                                        {priorityLabel}
                                                    </span>
                                                </div>
                                                <p className="mt-3 text-sm leading-6 text-slate-300 line-clamp-2 max-sm:text-xs max-sm:leading-5">
                                                    {task.description ?? "A focused task card with clean details and quick status visibility."}
                                                </p>
                                                <div className="mt-5 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => void handleMoveTask(task)}
                                                            disabled={movingTaskId === task.id}
                                                            aria-label={`Move ${task.title ?? "task"}`}
                                                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                                                        >
                                                            <ArrowRightIcon />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setTaskToDelete(task)}
                                                            disabled={deletingTaskId === task.id}
                                                            aria-label={`Delete ${task.title ?? "task"}`}
                                                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-rose-300 transition-colors hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                                                        >
                                                            <TrashIcon />
                                                        </button>
                                                    </div>
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white ring-1 ring-white/10">
                                                        {assigneeInitials}
                                                    </div>
                                                </div>
                                            </article>
                                        );
                                    })
                                ) : (
                                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-sm text-slate-400 backdrop-blur-md">
                                        No tasks in this lane yet.
                                    </div>
                                )}
                            </section>
                        );
                    })}
                </div>
            </div>

            {isCreateModalOpen && (
                <CreateTaskModal
                    createForm={createForm}
                    hasReachedLimit={hasReachedLimit}
                    isCreating={isCreating}
                    isUpgrading={isUpgrading}
                    onChange={(field, value) => setCreateForm((form) => ({ ...form, [field]: value }))}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSubmit={handleCreateTask}
                    onUpgrade={() => void handleUpgrade()}
                />
            )}

            {paymentModal && (
                <PaymentResultModal
                    result={paymentModal}
                    isUpgrading={isUpgrading}
                    onClose={() => setPaymentModal(null)}
                    onUpgrade={() => void handleUpgrade()}
                />
            )}

            {taskToDelete && (
                <DeleteConfirmationModal
                    task={taskToDelete}
                    isDeleting={deletingTaskId === taskToDelete.id}
                    onClose={() => setTaskToDelete(null)}
                    onConfirm={() => void handleDeleteTask()}
                />
            )}
        </main>
    );
}

function resolvePremiumStatusFromStorage() {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
        return false;
    }

    try {
        const user = JSON.parse(storedUser) as {
            isPremium?: unknown;
            ispremium?: unknown;
            ispreium?: unknown;
            premium?: unknown;
            subscriptionStatus?: unknown;
            plan?: unknown;
        };

        return (
            user.isPremium === true ||
            user.ispremium === true ||
            user.ispreium === true ||
            user.premium === true ||
            user.subscriptionStatus === "active" ||
            user.plan === "premium"
        );
    } catch {
        return false;
    }
}

function markStoredUserAsPremium(currentUser: UserValue) {
    const storedUser = localStorage.getItem("user");
    const premiumFields = {
        isPremium: true,
        premium: true,
        plan: "premium",
        subscriptionStatus: "active",
    };

    try {
        const parsedUser = storedUser ? JSON.parse(storedUser) : currentUser;
        const nextUser =
            typeof parsedUser === "object" && parsedUser !== null
                ? { ...parsedUser, ...premiumFields }
                : { name: typeof parsedUser === "string" ? parsedUser : getUserDisplayName(currentUser), ...premiumFields };

        localStorage.setItem("user", JSON.stringify(nextUser));
        return nextUser as UserValue;
    } catch {
        const nextUser = {
            name: getUserDisplayName(currentUser),
            email: getUserEmail(currentUser) === "No email available" ? undefined : getUserEmail(currentUser),
            ...premiumFields,
        };

        localStorage.setItem("user", JSON.stringify(nextUser));
        return nextUser as UserValue;
    }
}

function getCheckoutSessionId(data: unknown) {
    if (typeof data !== "object" || data === null) {
        return null;
    }

    const responseData = data as {
        sessionId?: unknown;
        id?: unknown;
        data?: { sessionId?: unknown; id?: unknown; session?: { id?: unknown } };
        session?: { id?: unknown };
    };
    const sessionId =
        responseData.sessionId ??
        responseData.id ??
        responseData.session?.id ??
        responseData.data?.sessionId ??
        responseData.data?.id ??
        responseData.data?.session?.id;

    return typeof sessionId === "string" && sessionId.trim() ? sessionId : null;
}

function getCheckoutUrl(data: unknown) {
    if (typeof data !== "object" || data === null) {
        return null;
    }

    const responseData = data as {
        url?: unknown;
        checkoutUrl?: unknown;
        data?: { url?: unknown; checkoutUrl?: unknown; session?: { url?: unknown } };
        session?: { url?: unknown };
    };
    const url =
        responseData.url ??
        responseData.checkoutUrl ??
        responseData.session?.url ??
        responseData.data?.url ??
        responseData.data?.checkoutUrl ??
        responseData.data?.session?.url;

    return typeof url === "string" && url.trim() ? url : null;
}

function getUserEmail(user: UserValue) {
    if (!user) {
        return "No email available";
    }

    if (typeof user === "string") {
        return user.includes("@") ? user : "No email available";
    }

    return user.email?.trim() || "No email available";
}
