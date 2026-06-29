import DashboardAddProperty from "@/components/dashboard/add-property";
import Head from "next/head";
import Wrapper from "@/layouts/Wrapper";
import { SHARE_BANNERS } from "@/utils/shareBanners";

export const metadata = {
   title: "Dashboard Add Property",
};
const index = () => {
   const title = "List a Room | Domakin";
   const description = "List your room on Domakin and connect with students looking for accommodation in the Netherlands.";
   const url = "https://www.domakin.nl/account/add-listing";

   return (
      <Wrapper>
         <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url} />
            <meta property="og:site_name" content="Domakin" />
            <meta property="og:image" content={SHARE_BANNERS.upload} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={title} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={SHARE_BANNERS.upload} />
            <meta name="twitter:image:alt" content={title} />
         </Head>
         <DashboardAddProperty />
      </Wrapper>
   )
}

export default index
