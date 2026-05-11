import { type NextRequest } from 'next/server';
import { searchDocs } from '@/docs/lib/search';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('query') ?? '';
  return Response.json(await searchDocs(q));
}
