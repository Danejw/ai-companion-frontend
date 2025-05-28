import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { screen_id?: number; response?: unknown; complete?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  try {
    const res = await fetch(`${BACKEND_URL}/onboarding/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({ error: 'Invalid response' }));

    if (!res.ok) {
      console.error('Onboarding update error:', data);
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Onboarding update failed:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
