import { getUsageStats } from "@/lib/redis";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const stats = await getUsageStats();

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching usage stats:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch usage statistics",
      },
      { status: 500 }
    );
  }
}
