import { isStravaConfigured } from "@/lib/strava/config";

export async function GET() {
  return Response.json({
    ok: true,
    configured: isStravaConfigured(),
  });
}
