import { createCmsPage } from "@/lib/cms/route";

const page = createCmsPage("/roditelyam/raspisanie/");
export const generateMetadata = page.generateMetadata;
export default page.Page;
