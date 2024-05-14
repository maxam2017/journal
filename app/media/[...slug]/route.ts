import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string[] } },
) {
  const searchParams = request.nextUrl.searchParams;

  const res = await fetch(
    new URL(
      `/${params.slug.join("/")}?${searchParams}`,
      process.env.NEWS_MEDIA_ORIGIN!,
    ),
    {
      headers: { accept: "image/*" },
      next: {
        revalidate: 24 * 60 * 60, // 24 hours
      },
    },
  );

  if (res.ok) {
    const blob = await res.blob();
    const buffer = await blob.arrayBuffer();

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Cache-Control": "max-age=86400, public",
      },
    });
  }

  return new Response(null, { status: 404 });
}
