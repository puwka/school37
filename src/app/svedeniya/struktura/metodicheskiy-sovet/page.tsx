import { createCmsPage } from "@/lib/cms/route";

const page = createCmsPage("/svedeniya/struktura/metodicheskiy-sovet/");
export const generateMetadata = page.generateMetadata;
export default page.Page;
