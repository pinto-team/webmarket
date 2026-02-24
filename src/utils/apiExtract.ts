// src/utils/apiExtract.ts
export function extractItems<T = any>(res: unknown): T[] {
    const r: any = res;

    const items =
        r?.items ??
        r?.data?.items ??
        r?.data?.data?.items ??
        r?.data?.data ??
        r?.data ??
        [];

    return Array.isArray(items) ? items : [];
}