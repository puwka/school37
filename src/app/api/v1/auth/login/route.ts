import { handleLogin, jsonError, jsonOk } from "@/server/http";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await handleLogin(body);
    return jsonOk(data);
  } catch (error) {
    return jsonError(error);
  }
}
