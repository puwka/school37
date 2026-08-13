import { handleMe, jsonError, jsonOk } from "@/server/http";

export async function GET() {
  try {
    return jsonOk(await handleMe());
  } catch (error) {
    return jsonError(error);
  }
}
