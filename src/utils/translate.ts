import { resources } from "@/i18n/resource";

export const t = (key: string): string => {
  const value = resources.fa.translation[key as keyof typeof resources.fa.translation];
  return typeof value === 'string' ? value : key;
};
