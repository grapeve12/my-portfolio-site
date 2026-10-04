// app/api/inference/jobs/[id]/events/route.ts
// ai-inference-server의 SSE 스트림(GET /jobs/{id}/events)을 그대로 패스스루한다.
// 하트비트는 SSE comment(":")로 오므로 여기서 별도 처리 없이 그대로 전달해도 된다.
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const apiUrl = process.env.INFERENCE_API_URL;

  const upstream = await fetch(`${apiUrl}/jobs/${id}/events`, {
    headers: { Accept: "text/event-stream" },
    cache: "no-store",
  });

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
