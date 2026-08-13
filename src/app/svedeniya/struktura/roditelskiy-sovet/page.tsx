import { createCmsPage } from "@/lib/cms/route";

const page = createCmsPage("/svedeniya/struktura/roditelskiy-sovet/");
export const generateMetadata = page.generateMetadata;
export default page.Page;
