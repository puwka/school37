import { createCmsSlugPage } from "@/lib/cms/route";

const page = createCmsSlugPage("/o-shkole/profili/");
export const generateMetadata = page.generateMetadata;
export default page.Page;
