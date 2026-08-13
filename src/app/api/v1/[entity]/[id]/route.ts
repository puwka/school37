import { revalidatePath, revalidateTag } from "next/cache";
import { CmsError } from "@/server/errors";
import { getResource, jsonError, jsonOk } from "@/server/http";

type Params = { params: Promise<{ entity: string; id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { entity, id } = await params;
    const data = await getResource(entity).get(id);
    return jsonOk(data);
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { entity, id } = await params;
    const resource = getResource(entity);
    if (!resource.update) {
      throw new CmsError("Изменение недоступно", 405, "METHOD_NOT_ALLOWED");
    }
    const body = await request.json();
    const data = await resource.update(id, body);
    revalidateTag("cms", "max");
    revalidatePath("/", "layout");
    return jsonOk(data);
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { entity, id } = await params;
    const resource = getResource(entity);
    if (!resource.remove) {
      throw new CmsError("Удаление недоступно", 405, "METHOD_NOT_ALLOWED");
    }
    const data = await resource.remove(id);
    revalidateTag("cms", "max");
    revalidatePath("/", "layout");
    return jsonOk(data);
  } catch (error) {
    return jsonError(error);
  }
}
