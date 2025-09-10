import { action, makeAutoObservable, observable } from "mobx"

export default class BlogStore {
  rootStore;

  constructor(root: any) {
    makeAutoObservable(this);
    this.rootStore = root;
  }

  @observable loading = false;
  @observable postLoading = false;
  @observable posts = [];
  @observable currentPost = null;

  @action toggleBlogLoading = () => {
    this.loading = !this.loading;
  };

  @action togglePostLoading = () => {
    this.postLoading = !this.postLoading;
  };

  @action setBlogPosts = (posts: []) => {
    this.posts = posts;
  };
  
  @action setSSRBlogPosts = (posts: []) => {
    // For SSR data, we set the posts and ensure loading is false
    this.posts = posts;
    this.loading = false;
  };
  
  @action setCurrentPost = (post: any) => {
    this.currentPost = post;
  };
  
  @action setSSRCurrentPost = (post: any) => {
    // For SSR data, set the current post and ensure loading is false
    this.currentPost = post;
    this.postLoading = false;
  };
  
  @action findPostById = (id: string | number) => {
    // Try to find the post in our existing posts array
    return this.posts.find((post: any) => 
      post.id === id || post.id === parseInt(id as string)
    );
  };
}
