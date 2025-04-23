// Define interfaces for type safety
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  hair: Hair;
  gender: 'male' | 'female';
  company: Company;
  age: number;
}

export interface DepartmentStats {
  male: number;
  female: number;
  ageRange: string;
  hair: { [key: string]: number };
  addressUser: { [key: string]: number };
}

export interface GroupedData {
  [department: string]: DepartmentStats;
}

export interface Hair {
  color: string;
  type: string;
}

export interface Company {
  department: string;
  address: {
    postalCode: number;
  };
}