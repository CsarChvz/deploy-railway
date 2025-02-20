import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { radii } = await request.json();

    if (!Array.isArray(radii) || radii.length < 2 || radii.length > 5) {
      return NextResponse.json(
        { error: "Invalid input: Please provide 2-5 radii" },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://fastapi-container-production.up.railway.app/api/calculate-circles",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ radii: radii }),
      }
    );
    const data = await response.json();
    return Response.json(data);
  } catch {
    return NextResponse.json(
      { error: "Invalid input: Please provide 2-5 radii" },
      { status: 500 }
    );
  }
}
