import { createCmsPage } from "@/lib/cms/route";

const page = createCmsPage("/svedeniya/standarty/");
export const generateMetadata = page.generateMetadata;
export default page.Page;
