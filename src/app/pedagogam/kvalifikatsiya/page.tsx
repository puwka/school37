import { createCmsPage } from "@/lib/cms/route";

const page = createCmsPage("/pedagogam/kvalifikatsiya/");
export const generateMetadata = page.generateMetadata;
export default page.Page;
