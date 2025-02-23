import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
export default function handler() {
  const response = new NextResponse(null, { status: 301 });
  response.headers.set('Location', `/pm/${uuidv4()}`);
  return response;
}
