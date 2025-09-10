import { GetServerSideProps } from "next";

// This page simply redirects to /blog/[id] to consolidate our routes
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params || {};
  
  // Extract the actual ID (in case it contains slashes)
  let actualId;
  if (Array.isArray(id)) {
    actualId = id[0];
  } else {
    actualId = (id as string).split('/')[0];
  }
  
  actualId = actualId.trim();
  
  // Redirect to the main blog post page with just the ID
  const destination = `/blog/${actualId}`;
  
  return {
    redirect: {
      destination,
      permanent: false,
    },
  };
};

// This is just a placeholder component, it will never be rendered due to the redirect
const BlogPost = () => null;

export default BlogPost;
