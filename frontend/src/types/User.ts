export interface User {
  _id: string;
  userName: string;
  displayName?: string | null;
  email: string;
  address?: string;
  image: string;
  garden: {
    plantId: string;
    forTrade: boolean;
  }[];
  dateDeleted?: string | null;
  createdAt: string;
  updatedAt: string;
}
