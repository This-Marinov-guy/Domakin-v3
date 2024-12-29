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
    registration: "",
    description: "",
  },

  terms: {
    contact: false,
    legals: false,
  },

  images: [],
};

export default class PropertyStore {
  rootStore;

  @observable properties: any[] = [];

  @observable propertiesLoading: boolean = false;

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
    this.addListingData = { ...defaultFormData };

    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem("addListingData");
    }
  };

  @action
  togglePropertiesLoading = () => {
    this.propertiesLoading = !this.propertiesLoading;
  };
}
