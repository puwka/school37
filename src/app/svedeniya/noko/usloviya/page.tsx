import { createCmsPage } from "@/lib/cms/route";

const page = createCmsPage("/svedeniya/noko/usloviya/");
export const generateMetadata = page.generateMetadata;
export default page.Page;
