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

export type RecordFormValue = {
  "1": number;
  "2": number;
  "3": number;
  "4": number;
  "6": number;
  "5": number;
};
