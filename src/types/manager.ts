export interface SalesRep {
  id: number;
  name: string;
  month1: number[];
  month2: number[];
  month3: number[];
}

export interface Assessment {
  name: string;
  shortName: string;
}

export interface MonthAssessments {
  [key: string]: Assessment[];
}