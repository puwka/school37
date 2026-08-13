import { createCmsPage } from "@/lib/cms/route";

const page = createCmsPage("/svedeniya/struktura/pedsovet/");
export const generateMetadata = page.generateMetadata;
export default page.Page;
