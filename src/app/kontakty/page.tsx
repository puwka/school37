import { createCmsPage } from "@/lib/cms/route";

const page = createCmsPage("/kontakty/");
export const generateMetadata = page.generateMetadata;
export default page.Page;
