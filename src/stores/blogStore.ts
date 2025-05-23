import { action, makeAutoObservable, observable } from "mobx"

export default class BlogStore {
  rootStore;

  constructor(root: any) {
    makeAutoObservable(this);
    this.rootStore = root;
  }

  @observable loading = false;
  @observable posts = [];

  @action toggleBlogLoading = () => {
    this.loading = !this.loading;
  };

  @action setBlogPosts = (posts: []) => {
    this.posts = posts;
  };
}
