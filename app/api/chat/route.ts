export async function POST(request: Request) {
  try {
    const body = await request.json();

    const automateUrl = process.env.POWER_AUTOMATE_URL;

    if (!automateUrl) {
      return Response.json(
        { ok: false, error: "POWER_AUTOMATE_URL is missing" },
        { status: 500 }
      );
    }

    const automateResponse = await fetch(automateUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: body.message,
        source: "vercel-chatbot"
      })
    });

    const text = await automateResponse.text();

    let result: { reply?: string };

    try {
      result = JSON.parse(text);
    } catch {
      result = { reply: text };
    }

    return Response.json({
      ok: automateResponse.ok,
      status: automateResponse.status,
      reply: result.reply || text || "응답이 없습니다."
    });
  } catch {
    return Response.json(
      { ok: false, error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
