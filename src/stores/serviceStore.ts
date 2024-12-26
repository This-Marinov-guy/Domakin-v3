import { action, makeAutoObservable, observable } from "mobx"

export default class ServiceStore {
  rootStore;

  constructor(root: any) {
    makeAutoObservable(this);
    this.rootStore = root;
  }

  @observable loading = false;
  @observable error = null;

  @action startLoading = () => {
    this.loading = true;
  }

  @action stopLoading = () => {
    this.loading = false;
  }
}
