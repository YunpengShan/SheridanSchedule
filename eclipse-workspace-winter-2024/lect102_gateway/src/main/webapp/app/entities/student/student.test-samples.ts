import dayjs from 'dayjs/esm';

import { IStudent, NewStudent } from './student.model';

export const sampleWithRequiredData: IStudent = {
  id: 14606,
};

export const sampleWithPartialData: IStudent = {
  id: 14434,
  name: 'longingly',
  email: 'Lula46@gmail.com',
  birthday: dayjs('2024-03-21'),
};

export const sampleWithFullData: IStudent = {
  id: 26759,
  name: 'uh-huh across officially',
  email: 'Colin_Moen@yahoo.com',
  birthday: dayjs('2024-03-21'),
};

export const sampleWithNewData: NewStudent = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
