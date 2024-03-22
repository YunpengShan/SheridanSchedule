import { IAddress, NewAddress } from './address.model';

export const sampleWithRequiredData: IAddress = {
  id: 24397,
};

export const sampleWithPartialData: IAddress = {
  id: 28045,
  provinceOrState: 'via softly rewind',
  country: 'Lebanon',
};

export const sampleWithFullData: IAddress = {
  id: 5044,
  street: 'Al Streets',
  city: 'Lake Faeboro',
  provinceOrState: 'whoever',
  country: 'Singapore',
};

export const sampleWithNewData: NewAddress = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
