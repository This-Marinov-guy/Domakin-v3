import { makeAutoObservable } from "mobx";

export default class ListRoomStore {
  rootStore: any;

  isCompleteForm = false;
  showDraftModal = false;

  constructor(root: any) {
    this.rootStore = root;
    makeAutoObservable(this);
  }

  setCompleteForm = (value: boolean) => {
    this.isCompleteForm = value;
  };

  openDraftModal = () => {
    this.showDraftModal = true;
  };

  closeDraftModal = () => {
    this.showDraftModal = false;
  };

  reset = () => {
    this.isCompleteForm = false;
    this.showDraftModal = false;
  };
}

