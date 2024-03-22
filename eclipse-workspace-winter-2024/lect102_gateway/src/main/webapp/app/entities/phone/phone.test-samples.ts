import { IPhone, NewPhone } from './phone.model';

export const sampleWithRequiredData: IPhone = {
  id: 31410,
};

export const sampleWithPartialData: IPhone = {
  id: 23953,
  phone: '668-685-7687',
};

export const sampleWithFullData: IPhone = {
  id: 8623,
  phone: '438.649.8378',
};

export const sampleWithNewData: NewPhone = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
