import BlogStore from "./blogStore";
import CommonStore from "./commonStore";
import ModalStore from "./modalStore";
import PropertyStore from "./propertyStore";
import ServiceStore from "./serviceStore";
import UserStore from "./userStore";
import ListRoomStore from "./listRoomStore";

class RootStore {
  commonStore;
  userStore;
  modalStore;
  propertyStore;
  serviceStore;
  blogStore;
  listRoomStore;

  constructor() {
    this.commonStore = new CommonStore(this);
    this.userStore = new UserStore(this);
    this.modalStore = new ModalStore(this);
    this.propertyStore = new PropertyStore(this);
    this.serviceStore = new ServiceStore(this);
    this.blogStore = new BlogStore(this);
    this.listRoomStore = new ListRoomStore(this);
  }
}

export const rootStore = new RootStore();