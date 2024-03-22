import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IPhone } from '../phone.model';
import { PhoneService } from '../service/phone.service';
import { PhoneFormService, PhoneFormGroup } from './phone-form.service';

@Component({
  standalone: true,
  selector: 'jhi-phone-update',
  templateUrl: './phone-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class PhoneUpdateComponent implements OnInit {
  isSaving = false;
  phone: IPhone | null = null;

  editForm: PhoneFormGroup = this.phoneFormService.createPhoneFormGroup();

  constructor(
    protected phoneService: PhoneService,
    protected phoneFormService: PhoneFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ phone }) => {
      this.phone = phone;
      if (phone) {
        this.updateForm(phone);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const phone = this.phoneFormService.getPhone(this.editForm);
    if (phone.id !== null) {
      this.subscribeToSaveResponse(this.phoneService.update(phone));
    } else {
      this.subscribeToSaveResponse(this.phoneService.create(phone));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPhone>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(phone: IPhone): void {
    this.phone = phone;
    this.phoneFormService.resetForm(this.editForm, phone);
  }
}
