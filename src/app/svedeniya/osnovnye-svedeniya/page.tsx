import { createCmsPage } from "@/lib/cms/route";

const page = createCmsPage("/svedeniya/osnovnye-svedeniya/");
export const generateMetadata = page.generateMetadata;
export default page.Page;
