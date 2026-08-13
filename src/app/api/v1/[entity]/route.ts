import { revalidatePath, revalidateTag } from "next/cache";
import { CmsError } from "@/server/errors";
import { getResource, jsonError, jsonOk } from "@/server/http";

type Params = { params: Promise<{ entity: string }> };

export async function GET(request: Request, { params }: Params) {
  try {
    const { entity } = await params;
    const resource = getResource(entity);
    const url = new URL(request.url);
    const input = Object.fromEntries(url.searchParams.entries());
    const data = await resource.list(input);
    return jsonOk(data);
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request, { params }: Params) {
  try {
    const { entity } = await params;
    const resource = getResource(entity);
    if (!resource.create) {
      throw new CmsError("Создание недоступно", 405, "METHOD_NOT_ALLOWED");
    }
    const body = await request.json();
    const data = await resource.create(body);
    revalidateTag("cms", "max");
    revalidatePath("/", "layout");
    return jsonOk(data, 201);
  } catch (error) {
    return jsonError(error);
  }
}
