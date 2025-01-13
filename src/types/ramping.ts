export interface MonthValue {
  value: string;
  note: string;
}

export interface RampingExpectation {
  id: string;
  metric: 'dm' | 'nbm' | 'scope_plus' | 'new_logo';
  month_1: MonthValue;
  month_2: MonthValue;
  month_3: MonthValue;
  month_4: MonthValue;
  month_5: MonthValue;
  month_6: MonthValue;
}

export const metricLabels: Record<string, string> = {
  dm: "DMs",
  nbm: "NBMs",
  scope_plus: "Scope+",
  new_logo: "NL",
};