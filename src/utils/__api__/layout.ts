import { cache } from "react";
import LayoutModel from "models/Layout.model";

const getLayoutData = cache(async (): Promise<LayoutModel> => {
  return {
    footer: {
      logo: "/assets/images/logo.svg",
      description: "",
      appStoreUrl: "",
      playStoreUrl: "",
      about: [],
      customers: [],
      socials: { google: "", twitter: "", youtube: "", facebook: "", instagram: "" },
      contact: { phone: "", email: "", address: "" }
    },
    header: {
      logo: "/assets/images/logo.svg",
      categories: [],
      categoryMenus: [],
      navigation: []
    },
    topbar: {
      title: "",
      label: "",
      socials: {},
      languageOptions: {}
    },
    mobileNavigation: {
      logo: "/assets/images/logo.svg",
      version1: [],
      version2: []
    }
  };
});

export default { getLayoutData };
