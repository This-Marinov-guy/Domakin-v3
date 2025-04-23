import { action, makeAutoObservable, observable } from "mobx";

const defaultFormData = {
  personalData: {
    name: "",
    surname: "",
    email: "",
    phone: "",
  },

  propertyData: {
    city: "",
    address: "",
    size: "",
    period: "",
    rent: "",
    bills: "",
    flatmates: "",
    registration: "yes",
    description: "",
  },

  referralCode: "",

  terms: {
    contact: false,
    legals: false,
  },

  images: [],
};

export default class PropertyStore {
  rootStore;

  @observable properties: any[] = [];
  @observable userProperties: any[] = [];

  @observable propertiesLoading: boolean = false;
  @observable userPropertiesLoading: boolean = false;

  @observable addListingData: any = { ...defaultFormData };
  @observable errorFields: string[] = [];

  constructor(root: any) {
    makeAutoObservable(this);
    this.rootStore = root;

    if (typeof window !== "undefined" && window.localStorage) {
      this.loadListingData();
    }
  }

  @action
  loadListingData = () => {
    const data = localStorage.getItem("addListingData");

    if (data) {
      this.addListingData = JSON.parse(data);
    } else {
      this.addListingData = { ...defaultFormData };
    }
  };

  @action
  setProperties = (properties: any[]) => {
    this.properties = properties;
  };

  @action
  updateListingData = (key: string, nestedKey: string, value: any) => {
    if (nestedKey) {
      this.addListingData[key][nestedKey] = value;
    } else {
      this.addListingData[key] = value;
    }

    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem(
        "addListingData",
        JSON.stringify(this.addListingData)
      );
    }
  };

  @action
  addErrorFields = (fields: string[]) => {
    this.errorFields = fields;
  };

  @action
  resetListingData = () => {
    const referralCode = this.addListingData.referralCode;

    this.addListingData = { ...defaultFormData, referralCode };

    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem("addListingData");
    }
  };

  @action
  setListingLoading = (loading: boolean) => {
    this.propertiesLoading = loading;
  };

  @action
  setReferralCode = (code: string) => {
    this.addListingData.referralCode = code;
  };

  @action
  setUserProperties = (properties: any[]) => {
    this.userProperties = properties;
  };

  @action
  setUserPropertiesLoading = (loading: boolean) => {
    this.userPropertiesLoading = loading;
  };

  @action
  statusLabel = (statusCode: Number) => {
    switch (statusCode) {
      case 1:
        return "Pending";
      case 2:
        return "Active";
      case 3:
        return "Declined";
      // TODO: think of better name for this status
      default:
        return "Pending";
    }
  };
}
