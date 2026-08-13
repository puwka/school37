import { createCmsPage } from "@/lib/cms/route";

const page = createCmsPage("/policy/");
export const generateMetadata = page.generateMetadata;
export default page.Page;
