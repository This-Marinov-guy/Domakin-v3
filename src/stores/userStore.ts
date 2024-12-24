import {action, computed, makeAutoObservable, observable, runInAction} from "mobx"

export default class UserStore {
  rootStore;

  constructor(root: any) {
    makeAutoObservable(this);
    this.rootStore = root;
  }
}