import {NextResponse} from 'next/server';
import {getStudyDatabase} from '@/lib/dataService';

export async function GET() {
  try {
    const database = getStudyDatabase();
    return NextResponse.json(database);
  } catch (error) {
    return NextResponse.json(
      {error: 'Failed to load study data'},
      {status: 500}
    );
  }
}
