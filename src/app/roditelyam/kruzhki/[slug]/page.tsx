import { createCmsSlugPage } from "@/lib/cms/route";

const page = createCmsSlugPage("/roditelyam/kruzhki/");
export const generateMetadata = page.generateMetadata;
export default page.Page;
