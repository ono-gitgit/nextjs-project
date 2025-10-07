export type Rank = {
  name: string;
  icon: string;
};

export type UserIcon = {
  path: string;
};

export type User = {
  name: string;
  email_address: string;
  password: string;
  icon_id: number;
};

export type Inquiry = {
  name: string;
  email_address: string;
  content: string;
};
type RadioOption = {
  value: number;
  src: string;
  alt: string;
};
export type FormArray = {
  label: string;
  name: string;
  value: string | number;
  validationRule?: object;
  type: string;
  link?: string;
  linkPath?: string;
  radioOptions?: RadioOption[];
};

export type LoginFormValue = {
  email_address: string;
  password: string | number;
};

export type CreateAccountFormValue = {
  name: string;
  email_address: string;
  password: string;
  icon_id: number;
};

export type GoalSettingFormValue = {
  goal: number;
};

export type RecordFromArray = {
  id: number;
  name: string;
};
