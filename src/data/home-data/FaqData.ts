interface DataType {
  id: number;
  title: string;
  content: string;
}

const faq_data: DataType[] = [
  {
    id: 1,
    title: "privacy_policy_content.information_we_collect",
    content: "privacy_policy_content.information_details",
  },
  {
    id: 2,
    title: "privacy_policy_content.how_we_use_your_information",
    content: "privacy_policy_content.usage_purposes",
  },
  {
    id: 3,
    title: "privacy_policy_content.sharing_of_information",
    content: "privacy_policy_content.sharing_circumstances",
  },
  {
    id: 4,
    title: "privacy_policy_content.your_choices",
    content: "privacy_policy_content.your_choices_description",
  },
  {
    id: 5,
    title: "privacy_policy_content.data_security",
    content: "privacy_policy_content.security_measures",
  },
  {
    id: 6,
    title: "privacy_policy_content.children_s_privacy",
    content: "privacy_policy_content.children_policy",
  },
  {
    id: 7,
    title: "privacy_policy_content.contracting",
    content: "privacy_policy_content.contract_policy",
  },
];

export default faq_data;