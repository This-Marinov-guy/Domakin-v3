import { COOKIE_MODAL, EDIT_PROPERTY_MODAL, LOGIN_MODAL, LONG_LOADING_MODAL } from "@/utils/defines";
import { makeAutoObservable, toJS } from "mobx";

const defaultModalSettings = {
  modalId: null,
  settings: {},
  onRemoveCallback: () => {},
};

const initialValues = {
  [COOKIE_MODAL]: false,
  [LOGIN_MODAL]: false,
  [EDIT_PROPERTY_MODAL]: false,
  [LONG_LOADING_MODAL]: false,
};

export default class ModalStore {
  rootStore: any;
  modals:any = initialValues;
  modalSettings = defaultModalSettings;
  historyStack: string[] = [];
  historyStackSettings: any[] = [];

  constructor(root: any) {
    this.rootStore = root;
    makeAutoObservable(this); // Automatically makes properties observable and methods actions
  }

  setActiveModal = (
    modalName: string,
    modalSettings: Record<string, any> = {},
    isResetLastActive: boolean = true
  ) => {
    if (isResetLastActive) {
      this.resetModal();
    }

    this.modals[modalName] = true;

    this.modalSettings = { ...this.modalSettings, ...modalSettings };

    if (this.lastUsedModal !== modalName) {
      this.historyStack.push(modalName);
      this.historyStackSettings.push(this.modalSettings);
    }
  }

  closeModal = () => {
    this.resetModal();
    this.historyStack.pop();
    this.historyStackSettings.pop();
    this.setPrevActiveModalFromQueue();
  }

  closeAll = () => {
    this.resetModal();
    this.resetHistoryStack();
  }

  resetHistoryStack = () => {
    this.historyStack = [];
  }

  resetModal = () => {
    this.modals = initialValues;
    this.modalSettings = defaultModalSettings;
  }

  setPrevActiveModalFromQueue = () => {
    if (this.historyStack.length > 0) {
      this.modals[this.lastUsedModal] = true;

      const lastUsedModalSettings = toJS(this.lastUsedModalSettings);

      this.modalSettings = { ...this.modalSettings, ...lastUsedModalSettings };
    }
  }

  changeActiveModalSettings = (newSettings: Record<string, any>) => {
    this.modalSettings = { ...this.modalSettings, ...newSettings };
  }

  get lastUsedModal() {
    return this.historyStack.slice(-1)[0];
  }

  get lastUsedModalSettings() {
    return this.historyStackSettings.slice(-1)[0];
  }
}

