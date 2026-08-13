import { createCmsPage } from "@/lib/cms/route";

const page = createCmsPage("/svedeniya/mezhdunarodnoe/");
export const generateMetadata = page.generateMetadata;
export default page.Page;
