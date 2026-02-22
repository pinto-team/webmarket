// src/app/api/front/[...path]/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerOrigin } from "@/utils/serverApi";

const DEFAULT_BACKEND = "https://api.taavoni.online/api/front";

/**
 * Normalize backend base so it ends with /api/front (no trailing slash)
 * Examples:
 * - https://api.x.com/api/front
 * - https://api.x.com/api/front/
 * - https://api.x.com            -> https://api.x.com/api/front
 */

function normalizeBackendBase(raw?: string): string {
    const base = (raw || DEFAULT_BACKEND).trim().replace(/\/+$/, "");
    if (!/\/api\/front$/.test(base)) return `${base}/api/front`;
    return base;
}

function buildTargetUrl(req: NextRequest, pathParts: string[]): string {
    const backendBase = normalizeBackendBase(process.env.NEXT_PUBLIC_API_BASE_URL);
    const incoming = new URL(req.url);

    const path = pathParts.map(encodeURIComponent).join("/");
    const target = new URL(`${backendBase}/${path}`);

    // Preserve query string
    target.search = incoming.search;

    return target.toString();
}

/**
 * Remove headers that must not be forwarded by proxies.
 * Also remove Accept-Encoding to avoid backend compression mismatch (ERR_CONTENT_DECODING_FAILED).
 */
function stripRequestHeaders(headers: Headers): Headers {
    const h = new Headers(headers);

    [
        "connection",
        "keep-alive",
        "proxy-authenticate",
        "proxy-authorization",
        "te",
        "trailer",
        "transfer-encoding",
        "upgrade",
        "host",
        "content-length",
    ].forEach((k) => h.delete(k));

    // ✅ Critical: prevent compressed responses from backend
    h.delete("accept-encoding");

    return h;
}

/**
 * Strip response headers that would conflict after we buffer/forward the body.
 * - content-encoding: browser would try to decode again
 * - content-length: may be wrong after buffering
 */
function stripResponseHeaders(headers: Headers): Headers {
    const h = new Headers(headers);

    [
        "connection",
        "keep-alive",
        "proxy-authenticate",
        "proxy-authorization",
        "te",
        "trailer",
        "transfer-encoding",
        "upgrade",
        "content-length",
        "content-encoding",
    ].forEach((k) => h.delete(k));

    return h;
}

async function handler(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
    const { path } = await ctx.params;

    // Derive origin from incoming request (useful in prod behind proxy)
    const host = req.headers.get("host") || undefined;
    const proto = req.headers.get("x-forwarded-proto") || "https";
    const derivedOrigin = host ? `${proto}://${host}` : undefined;

    // Centralized precedence: explicit arg -> TENANT_ORIGIN -> getOrigin() -> SITE_ORIGIN fallback
    const origin = (await getServerOrigin()) || derivedOrigin;
    const targetUrl = buildTargetUrl(req, path);

    console.log("[API Proxy] origin ->", origin, "target ->", targetUrl);

    // Forward most headers, but set tenant Origin server-side
    const outgoingHeaders = stripRequestHeaders(req.headers);
    if (origin) outgoingHeaders.set("origin", origin);

    // Body handling (GET/HEAD must not include body)
    const method = req.method.toUpperCase();
    const hasBody = !["GET", "HEAD"].includes(method);

    const res = await fetch(targetUrl, {
        method,
        headers: outgoingHeaders,
        body: hasBody ? await req.arrayBuffer() : undefined,
        redirect: "manual",
    });

    // Pass through status + safe headers
    const responseHeaders = stripResponseHeaders(res.headers);

    // Buffer the body to make NextResponse stable across runtimes
    const body = await res.arrayBuffer();

    return new NextResponse(body, {
        status: res.status,
        headers: responseHeaders,
    });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;