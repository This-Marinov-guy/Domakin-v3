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

  constructor(root: any) {
    makeAutoObservable(this);
    this.rootStore = root;
  }

  @observable addListingData: any = defaultFormData;
  @observable errorFields: string[] = [];

  @action updateListingData = (key: string, nestedKey: string, value: any) => {
    if (nestedKey) {
      this.addListingData[key][nestedKey] = value;
    } else {
      this.addListingData[key] = value;
    }
  }

  @action addErrorFields = (fields: string[]) => {
    this.errorFields = fields;
  }

  @action resetListingData = () => {
    this.addListingData = defaultFormData;
  }
}
