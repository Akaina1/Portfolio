import { getPayload } from 'payload';
import config from '@/payload.config';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get('limit') || '6', 10);

  try {
    const payload = await getPayload({ config });

    const projectsResponse = await payload.find({
      collection: 'projects',
      limit,
      sort: '-createdAt',
      depth: 1,
    });

    return NextResponse.json(projectsResponse.docs);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
