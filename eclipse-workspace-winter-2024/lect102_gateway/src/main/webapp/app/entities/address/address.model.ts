export interface IAddress {
  id: number;
  street?: string | null;
  city?: string | null;
  provinceOrState?: string | null;
  country?: string | null;
}

export type NewAddress = Omit<IAddress, 'id'> & { id: null };
