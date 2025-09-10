import { GetServerSideProps } from "next";

// This page simply redirects to /blog/[id] to consolidate our routes
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params || {};
  
  // Redirect to the main blog post page with just the ID
  return {
    redirect: {
      destination: `/blog/${id}`,
      permanent: false,
    },
  };
};

// This is just a placeholder component, it will never be rendered due to the redirect
const BlogPost = () => null;

export default BlogPost;
