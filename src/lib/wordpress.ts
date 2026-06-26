export type WordPressPost = {
  id: number;
  slug: string;
  date: string;
  modified?: string;
  title: { rendered: string };
  excerpt?: { rendered: string };
  content?: { rendered: string };
  _embedded?: {
    "wp:featuredmedia"?: { source_url: string }[];
  };
};

const WORDPRESS_POSTS_URL =
  "https://public-api.wordpress.com/wp/v2/sites/domakin0.wordpress.com/posts";

export async function fetchWordPressPosts(params = ""): Promise<WordPressPost[]> {
  const separator = params ? (params.startsWith("?") ? "" : "?") : "";
  const response = await fetch(`${WORDPRESS_POSTS_URL}${separator}${params}`);
  if (!response.ok) return [];

  const posts = await response.json();
  return Array.isArray(posts) ? posts : [];
}

export async function fetchWordPressPostById(id: string): Promise<WordPressPost | null> {
  const response = await fetch(`${WORDPRESS_POSTS_URL}/${encodeURIComponent(id)}?_embed=1`);
  if (!response.ok) return null;

  return (await response.json()) as WordPressPost;
}

export async function fetchWordPressPostBySlug(slug: string): Promise<WordPressPost | null> {
  const posts = await fetchWordPressPosts(`?slug=${encodeURIComponent(slug)}&_embed=1`);
  return posts[0] ?? null;
}

export async function fetchAllWordPressPostSummaries(): Promise<WordPressPost[]> {
  const posts: WordPressPost[] = [];

  for (let page = 1; page <= 20; page += 1) {
    const batch = await fetchWordPressPosts(
      `?per_page=100&page=${page}&_fields=id,slug,date,modified,title`,
    );

    if (batch.length === 0) break;

    posts.push(...batch);
    if (batch.length < 100) break;
  }

  return posts;
}
