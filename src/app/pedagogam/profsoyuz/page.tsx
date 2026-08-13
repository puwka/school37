import { createCmsPage } from "@/lib/cms/route";

const page = createCmsPage("/pedagogam/profsoyuz/");
export const generateMetadata = page.generateMetadata;
export default page.Page;
