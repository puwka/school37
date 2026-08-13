import { handleLogout, jsonError, jsonOk } from "@/server/http";

export async function POST() {
  try {
    return jsonOk(await handleLogout());
  } catch (error) {
    return jsonError(error);
  }
}
