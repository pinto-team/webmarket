import { headers } from 'next/headers';

export async function getOrigin(): Promise<string | undefined> {
  if (typeof window !== 'undefined') return undefined;
  
  const headersList = await headers();
  const host = headersList.get('host');
  const proto = headersList.get('x-forwarded-proto') || 'https';
  
  return host ? `${proto}://${host}` : undefined;
}
