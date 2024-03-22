import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPhone, NewPhone } from '../phone.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPhone for edit and NewPhoneFormGroupInput for create.
 */
type PhoneFormGroupInput = IPhone | PartialWithRequiredKeyOf<NewPhone>;

type PhoneFormDefaults = Pick<NewPhone, 'id'>;

type PhoneFormGroupContent = {
  id: FormControl<IPhone['id'] | NewPhone['id']>;
  phone: FormControl<IPhone['phone']>;
};

export type PhoneFormGroup = FormGroup<PhoneFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PhoneFormService {
  createPhoneFormGroup(phone: PhoneFormGroupInput = { id: null }): PhoneFormGroup {
    const phoneRawValue = {
      ...this.getFormDefaults(),
      ...phone,
    };
    return new FormGroup<PhoneFormGroupContent>({
      id: new FormControl(
        { value: phoneRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      phone: new FormControl(phoneRawValue.phone),
    });
  }

  getPhone(form: PhoneFormGroup): IPhone | NewPhone {
    return form.getRawValue() as IPhone | NewPhone;
  }

  resetForm(form: PhoneFormGroup, phone: PhoneFormGroupInput): void {
    const phoneRawValue = { ...this.getFormDefaults(), ...phone };
    form.reset(
      {
        ...phoneRawValue,
        id: { value: phoneRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): PhoneFormDefaults {
    return {
      id: null,
    };
  }
}
