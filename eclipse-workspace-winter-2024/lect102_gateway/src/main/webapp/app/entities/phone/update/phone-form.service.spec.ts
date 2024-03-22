import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../phone.test-samples';

import { PhoneFormService } from './phone-form.service';

describe('Phone Form Service', () => {
  let service: PhoneFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhoneFormService);
  });

  describe('Service methods', () => {
    describe('createPhoneFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPhoneFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            phone: expect.any(Object),
          }),
        );
      });

      it('passing IPhone should create a new form with FormGroup', () => {
        const formGroup = service.createPhoneFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            phone: expect.any(Object),
          }),
        );
      });
    });

    describe('getPhone', () => {
      it('should return NewPhone for default Phone initial value', () => {
        const formGroup = service.createPhoneFormGroup(sampleWithNewData);

        const phone = service.getPhone(formGroup) as any;

        expect(phone).toMatchObject(sampleWithNewData);
      });

      it('should return NewPhone for empty Phone initial value', () => {
        const formGroup = service.createPhoneFormGroup();

        const phone = service.getPhone(formGroup) as any;

        expect(phone).toMatchObject({});
      });

      it('should return IPhone', () => {
        const formGroup = service.createPhoneFormGroup(sampleWithRequiredData);

        const phone = service.getPhone(formGroup) as any;

        expect(phone).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPhone should not enable id FormControl', () => {
        const formGroup = service.createPhoneFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPhone should disable id FormControl', () => {
        const formGroup = service.createPhoneFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
