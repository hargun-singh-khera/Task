export async function GET() {
  return Response.json({
    success: true,
    message: "Healthcheck passed. API is working",
  });
}