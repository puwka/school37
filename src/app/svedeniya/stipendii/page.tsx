import { createCmsPage } from "@/lib/cms/route";

const page = createCmsPage("/svedeniya/stipendii/");
export const generateMetadata = page.generateMetadata;
export default page.Page;
