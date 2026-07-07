export type UserValue = {
    name?: string;
    email?: string;
    initials?: string;
} | string | null;

export type Task = {
    id?: string | number;
    title?: string;
    description?: string;
    status?: string;
    tags?: string[] | string;
    priority?: string;
    assignee?: string;
    assigneeName?: string;
    assigneeInitials?: string;
};

export type TaskStatus = "To Do" | "In Progress" | "Done";

export type CreateTaskForm = {
    title: string;
    description: string;
};

export function performLogout(router: { replace: (href: string) => void }) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("name");
    router.replace("/login");
}

export function resolveStoredUser(storedUser: string | null, storedName: string | null, token: string): UserValue {
    if (storedName?.trim()) {
        return storedName.trim();
    }

    if (storedUser) {
        try {
            const parsedUser = JSON.parse(storedUser) as UserValue;
            const parsedName = typeof parsedUser === "object" && parsedUser !== null ? parsedUser.name?.trim() : undefined;
            const parsedEmail = typeof parsedUser === "object" && parsedUser !== null ? parsedUser.email?.trim() : undefined;

            if (parsedName || parsedEmail || typeof parsedUser === "string") {
                return parsedUser;
            }
        } catch {
            if (storedUser.trim()) {
                return storedUser.trim();
            }
        }
    }

    return resolveUserFromToken(token);
}

export function resolveUserFromToken(token: string): UserValue {
    const payload = decodeJwtPayload(token);

    if (!payload) {
        return "User";
    }

    const name = getStringValue(payload.name) ?? getStringValue(payload.fullName) ?? getStringValue(payload.username);
    const email = getStringValue(payload.email);

    return {
        name: name ?? getEmailName(email),
        email,
    };
}

export function decodeJwtPayload(token: string) {
    try {
        const payloadPart = token.split(".")[1];

        if (!payloadPart) {
            return null;
        }

        const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
        const decoded = decodeURIComponent(
            atob(padded)
                .split("")
                .map((character) => `%${character.charCodeAt(0).toString(16).padStart(2, "0")}`)
                .join("")
        );

        return JSON.parse(decoded) as Record<string, unknown>;
    } catch {
        return null;
    }
}

export function normalizeStatus(status?: string) {
    const normalized = (status ?? "").toLowerCase().replace(/[^a-z]/g, "");

    if (normalized.includes("done")) {
        return "done";
    }

    if (normalized.includes("progress")) {
        return "inprogress";
    }

    if (normalized.includes("todo") || normalized.includes("backlog") || normalized.includes("open")) {
        return "todo";
    }

    return "todo";
}

export function getNextStatus(status?: string): TaskStatus {
    const normalized = normalizeStatus(status);

    if (normalized === "todo") {
        return "In Progress";
    }

    if (normalized === "inprogress") {
        return "Done";
    }

    return "To Do";
}

export function getTaskTags(task: Task) {
    if (Array.isArray(task.tags)) {
        return task.tags.filter(Boolean);
    }

    if (typeof task.tags === "string" && task.tags.trim()) {
        return task.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean);
    }

    if (task.priority) {
        return [task.priority];
    }

    return [];
}

export function getTagClass(tag: string) {
    const normalized = tag.toLowerCase();

    if (normalized.includes("feature")) {
        return "border-fuchsia-400/20 bg-fuchsia-500/15 text-fuchsia-200";
    }

    if (normalized.includes("urgent") || normalized.includes("critical")) {
        return "border-rose-400/20 bg-rose-500/15 text-rose-200";
    }

    if (normalized.includes("backend")) {
        return "border-blue-400/20 bg-blue-500/15 text-blue-200";
    }

    if (normalized.includes("release") || normalized.includes("done")) {
        return "border-emerald-400/20 bg-emerald-500/15 text-emerald-200";
    }

    return "border-cyan-400/20 bg-cyan-500/15 text-cyan-200";
}

export function getUserDisplayName(user: UserValue) {
    if (!user) {
        return "User";
    }

    if (typeof user === "string") {
        const trimmed = user.trim();
        return getEmailName(trimmed) || trimmed || "User";
    }

    const name = user.name?.trim();
    const email = user.email?.trim();

    return name || getEmailName(email) || "User";
}

export function getUserInitials(user: UserValue) {
    if (!user) {
        return "U";
    }

    if (typeof user === "string") {
        return getInitialsFromString(getUserDisplayName(user));
    }

    if (user.initials) {
        return user.initials.slice(0, 2).toUpperCase();
    }

    return getInitialsFromString(getUserDisplayName(user));
}

export function getInitialsFromString(value: string) {
    const parts = value.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) {
        return "U";
    }

    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export function getAssigneeInitials(task: Task, fallbackName: string, fallbackInitials: string) {
    if (task.assigneeInitials) {
        return task.assigneeInitials.slice(0, 2).toUpperCase();
    }

    if (task.assigneeName) {
        return getInitialsFromString(task.assigneeName);
    }

    if (task.assignee) {
        return getInitialsFromString(task.assignee);
    }

    return fallbackInitials || getInitialsFromString(fallbackName);
}

export function getStringValue(value: unknown) {
    return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export function getEmailName(email?: string) {
    if (!email?.trim() || !email.includes("@")) {
        return undefined;
    }

    return email.split("@")[0] || undefined;
}

export function extractTaskFromResponse(data: unknown): Task | null {
    if (isTask(data)) {
        return data;
    }

    if (typeof data !== "object" || data === null) {
        return null;
    }

    const responseData = data as { task?: unknown; data?: unknown };

    if (isTask(responseData.task)) {
        return responseData.task;
    }

    if (isTask(responseData.data)) {
        return responseData.data;
    }

    return null;
}

export function isTask(value: unknown): value is Task {
    return typeof value === "object" && value !== null && ("title" in value || "description" in value || "status" in value);
}

export function isUnauthorizedError(error: unknown) {
    if (typeof error !== "object" || error === null) {
        return false;
    }

    if (!("response" in error)) {
        return false;
    }

    const response = error as { response?: { status?: number } };
    return response.response?.status === 401;
}

export function isFreeTierLimitError(error: unknown) {
    if (typeof error !== "object" || error === null || !("response" in error)) {
        return false;
    }

    const response = error as { response?: { status?: number } };
    return response.response?.status === 403;
}

export function getApiErrorMessage(error: unknown, fallbackMessage: string) {
    if (typeof error !== "object" || error === null) {
        return fallbackMessage;
    }

    if ("message" in error && typeof (error as { message: unknown }).message === "string") {
        const message = (error as { message: string }).message;
        if (message.toLowerCase().includes("network error") || message.toLowerCase().includes("failed to fetch")) {
            return "Network error. Please check your connection and try again.";
        }
    }

    if ("response" in error) {
        const response = (error as { response?: { data?: any } }).response;
        if (response?.data) {
            const data = response.data;
            const message = data.message || data.error || (typeof data === "string" ? data : null);
            if (typeof message === "string" && message.trim()) {
                return message;
            }
        }
    }

    return fallbackMessage;
}
