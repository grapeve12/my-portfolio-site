// app/api/inference/jobs/route.ts
// ai-inference-server의 POST /jobs를 same-origin으로 프록시한다.
// 브라우저는 이 origin(localhost:3000)만 호출하므로 CORS가 필요 없다.
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  const apiUrl = process.env.INFERENCE_API_URL;
  const userId = process.env.INFERENCE_GUEST_USER_ID;

  const res = await fetch(`${apiUrl}/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: Number(userId) }),
    cache: "no-store",
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
