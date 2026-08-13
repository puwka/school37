import { createCmsPage } from "@/lib/cms/route";

const page = createCmsPage("/o-shkole/istoriya/");
export const generateMetadata = page.generateMetadata;
export default page.Page;
