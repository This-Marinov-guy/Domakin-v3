import { action, makeAutoObservable, observable } from "mobx";

const defaultViewingData = {
  name: "",
  surname: "",
  email: "",
  phone: "",
  city: "",
  address: "",
  date: "",
  time: "",
  note: "",
  referralCode: "",

  terms: {
    contact: false,
    legals: false,
  },
};

const defaultSearchingData = {
  name: "",
  surname: "",
  email: "",
  phone: "",
  city: "",
  registration: true,
  budget: "",
  type: "",
  people: "",
  moveIn: "",
  period: "",
  letter: null,
  note: "",
  referralCode: "",

  terms: {
    contact: false,
    legals: false,
  },
};

const defaultRentingData = {
  property: "",
  name: "",
  surname: "",
  email: "",
  phone: "",
  letter: null,
  note: "",
  referralCode: '',

  terms: {
    contact: false,
    legals: false,
  },
};

export default class ServiceStore {
  rootStore;

  constructor(root: any) {
    makeAutoObservable(this);
    this.rootStore = root;
  }

  // viewing
  @observable viewingData: any = { ...defaultViewingData };
  @observable viewingErrorFields: string[] = [];

  @action
  updateViewingData = (key: string, nestedKey: string, value: any) => {
    if (nestedKey) {
      this.viewingData[key][nestedKey] = value;
    } else {
      this.viewingData[key] = value;
    }
  };

  @action
  addViewingErrorFields = (fields: string[]) => {
    this.viewingErrorFields = fields;
  };

  @action
  resetViewingData = () => {
    const referralCode = this.viewingData.referralCode;

    this.viewingData = { ...defaultViewingData, referralCode };
  };

  // room searching
  @observable searchingData: any = { ...defaultSearchingData };
  @observable searchingErrorFields: string[] = [];

  @action
  updateSearchingData = (key: string, nestedKey: string, value: any) => {
    if (nestedKey) {
      this.searchingData[key][nestedKey] = value;
    } else {
      this.searchingData[key] = value;
    }
  };

  @action
  addSearchingErrorFields = (fields: string[]) => {
    this.searchingErrorFields = fields;
  };

  @action
  resetSearchingData = () => {
    const referralCode = this.searchingData.referralCode;

    this.searchingData = { ...defaultSearchingData, referralCode };
  };

  // renting
  @observable rentingData: any = { ...defaultRentingData };
  @observable rentingErrorFields: string[] = [];

  @action
  updateRentingData = (key: string, nestedKey: string, value: any) => {
    if (nestedKey) {
      this.rentingData[key][nestedKey] = value;
    } else {
      this.rentingData[key] = value;
    }
  };

  @action
  addRentingErrorFields = (fields: string[]) => {
    this.rentingErrorFields = fields;
  };

  @action
  resetRentingData = () => {
    const referralCode = this.rentingData.referralCode;

    this.rentingData = { ...defaultRentingData, referralCode };
  };

  @action
  setReferralCode = (code: string) => {
    this.viewingData.referralCode = code;
    this.searchingData.referralCode = code;
    this.rentingData.referralCode = code;
  }
}
