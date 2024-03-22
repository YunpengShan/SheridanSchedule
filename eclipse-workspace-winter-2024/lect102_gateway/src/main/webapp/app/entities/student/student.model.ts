import dayjs from 'dayjs/esm';

export interface IStudent {
  id: number;
  name?: string | null;
  email?: string | null;
  birthday?: dayjs.Dayjs | null;
}

export type NewStudent = Omit<IStudent, 'id'> & { id: null };
