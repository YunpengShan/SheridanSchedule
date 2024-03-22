import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPhone } from '../phone.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../phone.test-samples';

import { PhoneService } from './phone.service';

const requireRestSample: IPhone = {
  ...sampleWithRequiredData,
};

describe('Phone Service', () => {
  let service: PhoneService;
  let httpMock: HttpTestingController;
  let expectedResult: IPhone | IPhone[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PhoneService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Phone', () => {
      const phone = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(phone).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Phone', () => {
      const phone = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(phone).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Phone', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Phone', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Phone', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPhoneToCollectionIfMissing', () => {
      it('should add a Phone to an empty array', () => {
        const phone: IPhone = sampleWithRequiredData;
        expectedResult = service.addPhoneToCollectionIfMissing([], phone);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(phone);
      });

      it('should not add a Phone to an array that contains it', () => {
        const phone: IPhone = sampleWithRequiredData;
        const phoneCollection: IPhone[] = [
          {
            ...phone,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPhoneToCollectionIfMissing(phoneCollection, phone);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Phone to an array that doesn't contain it", () => {
        const phone: IPhone = sampleWithRequiredData;
        const phoneCollection: IPhone[] = [sampleWithPartialData];
        expectedResult = service.addPhoneToCollectionIfMissing(phoneCollection, phone);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(phone);
      });

      it('should add only unique Phone to an array', () => {
        const phoneArray: IPhone[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const phoneCollection: IPhone[] = [sampleWithRequiredData];
        expectedResult = service.addPhoneToCollectionIfMissing(phoneCollection, ...phoneArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const phone: IPhone = sampleWithRequiredData;
        const phone2: IPhone = sampleWithPartialData;
        expectedResult = service.addPhoneToCollectionIfMissing([], phone, phone2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(phone);
        expect(expectedResult).toContain(phone2);
      });

      it('should accept null and undefined values', () => {
        const phone: IPhone = sampleWithRequiredData;
        expectedResult = service.addPhoneToCollectionIfMissing([], null, phone, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(phone);
      });

      it('should return initial array if no Phone is added', () => {
        const phoneCollection: IPhone[] = [sampleWithRequiredData];
        expectedResult = service.addPhoneToCollectionIfMissing(phoneCollection, undefined, null);
        expect(expectedResult).toEqual(phoneCollection);
      });
    });

    describe('comparePhone', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePhone(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePhone(entity1, entity2);
        const compareResult2 = service.comparePhone(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePhone(entity1, entity2);
        const compareResult2 = service.comparePhone(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePhone(entity1, entity2);
        const compareResult2 = service.comparePhone(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
