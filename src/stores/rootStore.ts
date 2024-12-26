import CommonStore from './commonStore';
import ModalStore from './modalStore';
import PropertyStore from './propertyStore';
import ServiceStore from './serviceStore';
import UserStore from './userStore';

class RootStore {
  commonStore;
  userStore;
  modalStore;
  propertyStore;
  servicesStore;

  constructor() {
    this.commonStore = new CommonStore(this);
    this.userStore = new UserStore(this);
    this.modalStore = new ModalStore(this);
    this.propertyStore = new PropertyStore(this);
    this.servicesStore = new ServiceStore(this);
  }
}

export const rootStore = new RootStore();