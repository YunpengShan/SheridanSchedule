export interface IPhone {
  id: number;
  phone?: string | null;
}

export type NewPhone = Omit<IPhone, 'id'> & { id: null };
