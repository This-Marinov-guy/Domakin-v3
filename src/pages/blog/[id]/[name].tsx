import { GetServerSideProps } from "next";

// This page simply redirects to /blog/[id] to consolidate our routes
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id, name } = context.params || {};
  const lang = context.locale || "en";
  
  console.log(`[Blog Name Redirect] Redirecting from [id]/[name] format`);
  console.log(`[Blog Name Redirect] ID: ${id}, Name: ${name}, Language: ${lang}`);
  
  // Extract the actual ID (in case it contains slashes)
  let actualId;
  if (Array.isArray(id)) {
    actualId = id[0];
  } else {
    actualId = (id as string).split('/')[0];
  }
  
  actualId = actualId.trim();
  console.log(`[Blog Name Redirect] Normalized ID: ${actualId}`);
  
  // Redirect to the main blog post page with just the ID
  const destination = `/blog/${actualId}`;
  console.log(`[Blog Name Redirect] Redirecting to: ${destination}`);
  
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
