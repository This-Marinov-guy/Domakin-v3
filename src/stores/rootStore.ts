import CommonStore from './commonStore';
import ModalStore from './modalStore';
import UserStore from './userStore';

class RootStore {
  commonStore;
  userStore;
  modalStore;

  constructor() {
    this.commonStore = new CommonStore(this);
    this.userStore = new UserStore(this);
    this.modalStore = new ModalStore(this);
  }
}

export const rootStore = new RootStore();