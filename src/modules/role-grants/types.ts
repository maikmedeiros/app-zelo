export interface RoleGrantOutput {
  id: string;
  userId: string;
  userName: string;
  roleId: string;
  roleCode: string;
  roleName: string;
  grantedById: string | null;
  grantedByName: string | null;
  startDate: string;
  endDate: string | null;
}

export const isCurrent = (grant: RoleGrantOutput): boolean => grant.endDate === null;
