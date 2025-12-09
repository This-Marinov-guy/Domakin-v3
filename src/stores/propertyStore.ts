import { stat } from "fs";
import { isEmpty } from "lodash";
import { action, makeAutoObservable, observable, toJS } from "mobx";

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
    postcode: "",
    size: "",
    period: "",
    rent: "",
    bills: "",
    flatmates: "",
    registration: true,
    description: "",
    petsAllowed: false,
    smokingAllowed: false,
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

  @observable propertiesListFilters: any = {};

  @observable properties: any[] = [];
  @observable userProperties: any[] = [];

  @observable propertiesLoading: boolean = false;
  @observable userPropertiesLoading: boolean = false;

  @observable addListingData: any = { ...defaultFormData };
  @observable errorFields: string[] = [];

  @observable editPropertyData: any = { ...defaultFormData };
  @observable editErrorFields: string[] = [];

  constructor(root: any) {
    makeAutoObservable(this);
    this.rootStore = root;

    if (typeof window !== "undefined" && window.localStorage) {
      this.loadListingData();
    }
  }

  @action
  setPropertiesListFilters = (filters: any) => {
    this.propertiesListFilters = filters;
  };

  @action
  loadPropertyDataForEdit = (id: any) => {
    const property = this.properties.find((property) => property.id === id);

    if (!property) return;

    this.editPropertyData = property;
  };

  @action
  setPropertyDataForEdit = (property: any) => {
    if (isEmpty(property)) return;

    this.editPropertyData = {
      id: property.id,
      approved: property.approved,
      status: property.status,
      releaseTimestamp: property.release_timestamp,
      referralCode: property.referral_code,
      is_signal: property.is_signal || false,
      propertyData: {
        ...property.property_data,
        bills: JSON.parse(property.property_data.bills),
        flatmates: JSON.parse(property.property_data.flatmates),
        description: JSON.parse(property.property_data.description),
        period: JSON.parse(property.property_data.period),
        title: property?.property_data?.title
          ? JSON.parse(property.property_data.title ?? "")
          : property.property_data.title,
        images: property?.property_data?.images,
      },
      newImages: [],
    };
  };

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
    this.properties = toJS(properties);
  };
  
  @action
  setSSRProperties = (properties: any[]) => {
    // For SSR data, set properties and ensure loading state is false
    this.properties = toJS(properties);
    this.propertiesLoading = false;
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
  updateEditListingData = (key: string, nestedKey: string, value: any) => {
    if (nestedKey) {
      // if (!this.editPropertyData[key]) {
      //   this.editPropertyData[key] = {};
      // }

      this.editPropertyData[key][nestedKey] = value;
    } else {
      this.editPropertyData[key] = value;
    }
  };

  @action
  updateMainImage = (index: number) => {
    const mainImage = this.editPropertyData.propertyData.images[index];
    this.editPropertyData.propertyData.images = [
      mainImage,
      ...this.editPropertyData.propertyData.images.slice(0, index),
      ...this.editPropertyData.propertyData.images.slice(index + 1),
    ];
  };

  @action
  removeImage = (index: number) => {
    this.editPropertyData.propertyData.images = [
      ...this.editPropertyData.propertyData.images.slice(0, index),
      ...this.editPropertyData.propertyData.images.slice(index + 1),
    ];
  };

  @action
  addErrorFields = (fields: string[]) => {
    this.errorFields = fields;
  };

  @action
  addEditErrorFields = (fields: string[]) => {
    this.editErrorFields = fields;
  };

  @action
  resetListingData = () => {
    const globalData = {
      name: this.addListingData.personalData.name,
      surname: this.addListingData.personalData.surname,
      email: this.addListingData.personalData.email,
      phone: this.addListingData.personalData.phone,
      referralCode: this.addListingData.referralCode,
    };

    this.addListingData = { ...defaultFormData, ...globalData };

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
