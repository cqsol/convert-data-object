import { getData, groupByDepartment } from '../utils';
import { User } from '../types';

describe('getData', () => {
  it('should fetch users data', async () => {
    const users = await getData();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
  });

  it('should handle fetch errors', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
    const users = await getData();
    expect(users).toEqual([]);
  });

  it('should handle non-ok response', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404
    });
    const users = await getData();
    expect(users).toEqual([]);
  });
});

describe('groupByDepartment', () => {
  const mockUsers: User[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      hair: { color: 'black', type: 'straight' },
      gender: 'male' as const,
      company: { department: 'Engineering', address: { postalCode: 12345 } },
      age: 30
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      hair: { color: 'blonde', type: 'curly' },
      gender: 'female' as const,
      company: { department: 'Engineering', address: { postalCode: 12345 } },
      age: 25
    }
  ];

  it('should group users by department', () => {
    const groupedData = groupByDepartment(mockUsers);
    expect(groupedData['Engineering']).toBeDefined();
    expect(groupedData['Engineering'].male).toBe(1);
    expect(groupedData['Engineering'].female).toBe(1);
    expect(groupedData['Engineering'].ageRange).toBe('25-30');
    expect(groupedData['Engineering'].hair['black']).toBe(1);
    expect(groupedData['Engineering'].hair['blonde']).toBe(1);
  });

    it('should handle empty user array', () => {
        const groupedData = groupByDepartment([]);
        expect(Object.keys(groupedData).length).toBe(0);
    });

    it('should handle multiple departments', () => {
        const multiDeptUsers = [
            ...mockUsers,
            {
                id: 3,
                firstName: 'Bob',
                lastName: 'Johnson',
                hair: { color: 'brown', type: 'wavy' },
                gender: 'male' as const,
                company: { department: 'Marketing', address: { postalCode: 54321 } },
                age: 35
            }
        ];
        const groupedData = groupByDepartment(multiDeptUsers);
        expect(Object.keys(groupedData).length).toBe(2);
        expect(groupedData['Marketing']).toBeDefined();
        expect(groupedData['Marketing'].male).toBe(1);
        expect(groupedData['Marketing'].ageRange).toBe('35-35');
    });
});