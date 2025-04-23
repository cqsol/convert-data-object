import { User, GroupedData } from './types';

export async function getData(): Promise<User[]> {
    const url = "https://dummyjson.com/users";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      return json.users;
    } catch (error) {
      console.error(error);
      return [];
    }
}

export function groupByDepartment(users: User[]): GroupedData {
    return users.reduce((acc, user) => {
        const {company, gender, hair, firstName, lastName, age} = user;
        const department = company.department;
        const postalCode = company.address.postalCode;
        const hairColor: string = hair.color;
        const fullname: string = firstName + lastName;
        
        if (!acc[department]) {
            acc[department] = {
                male: 0,
                female: 0,
                ageRange: `${age}-${age}`,
                hair: {},
                addressUser: {}
            }
        } 

        acc[department]['hair'][hairColor] = (acc[department]['hair'][hairColor] || 0) + 1;
        acc[department]['addressUser'][fullname] = postalCode;
        if (gender === 'male') acc[department]['male'] +=1;
        if (gender === 'female') acc[department]['female'] +=1;
        
        let [minAge, maxAge] = acc[department]['ageRange'].split('-').map(Number);
        if (age < minAge) minAge = age;
        if (age > maxAge) maxAge = age;
        acc[department]['ageRange'] = `${minAge}-${maxAge}`;
      return acc;
    }, {} as GroupedData);
}

async function main() {
    const users = await getData();
    groupByDepartment(users);
    // console.info('Grouped Data:', groupByDepartment(users));
}

main();