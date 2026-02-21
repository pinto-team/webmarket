type LoginNavigationOptions = {
    next?: string | null;
    modal?: boolean;
};

export type PostLoginNavigation =
    | { type: "replace"; href: string }
    | { type: "back" };

export const DEFAULT_AUTH_REDIRECT = "/";

export function getSafeNextUrl(next?: string | null): string | null {
    if (!next) return null;

    const trimmedNext = next.trim();
    if (!trimmedNext.startsWith("/")) return null;
    if (trimmedNext.startsWith("//")) return null;

    return trimmedNext;
}

export function getLoginUrl(options: LoginNavigationOptions = {}): string {
    const params = new URLSearchParams();
    const safeNext = getSafeNextUrl(options.next);

    if (safeNext) params.set("next", safeNext);
    if (options.modal) params.set("modal", "1");

    const query = params.toString();
    return query ? `/login?${query}` : "/login";
}

export function getPostLoginNavigation(next?: string | null, isModal?: boolean): PostLoginNavigation {
    const safeNext = getSafeNextUrl(next);

    if (safeNext) {
        return { type: "replace", href: safeNext };
    }

    if (isModal) {
        return { type: "back" };
    }

    return { type: "replace", href: DEFAULT_AUTH_REDIRECT };
}
