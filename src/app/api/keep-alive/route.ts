import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// Cron job to keep Supabase free-tier database from pausing
// Supabase pauses after 7 days of inactivity on the free plan
export async function GET(request: Request) {
  // Verify the request comes from Vercel Cron (in production)
  const authHeader = request.headers.get('authorization');
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isSupabaseConfigured) {
    return NextResponse.json({ status: 'skipped', reason: 'Supabase not configured' });
  }

  // Simple query to keep the database active
  const { count, error } = await supabase
    .from('test_results')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Keep-alive ping failed:', error);
    return NextResponse.json({ status: 'error', error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    resultCount: count,
  });
}
