import { createCmsPage } from "@/lib/cms/route";

const page = createCmsPage("/roditelyam/lager/");
export const generateMetadata = page.generateMetadata;
export default page.Page;
