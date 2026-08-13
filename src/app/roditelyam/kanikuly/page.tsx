import { createCmsPage } from "@/lib/cms/route";

const page = createCmsPage("/roditelyam/kanikuly/");
export const generateMetadata = page.generateMetadata;
export default page.Page;
