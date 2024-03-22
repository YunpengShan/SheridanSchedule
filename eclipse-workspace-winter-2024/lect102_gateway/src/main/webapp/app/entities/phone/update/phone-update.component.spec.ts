import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PhoneService } from '../service/phone.service';
import { IPhone } from '../phone.model';
import { PhoneFormService } from './phone-form.service';

import { PhoneUpdateComponent } from './phone-update.component';

describe('Phone Management Update Component', () => {
  let comp: PhoneUpdateComponent;
  let fixture: ComponentFixture<PhoneUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let phoneFormService: PhoneFormService;
  let phoneService: PhoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), PhoneUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(PhoneUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PhoneUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    phoneFormService = TestBed.inject(PhoneFormService);
    phoneService = TestBed.inject(PhoneService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const phone: IPhone = { id: 456 };

      activatedRoute.data = of({ phone });
      comp.ngOnInit();

      expect(comp.phone).toEqual(phone);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPhone>>();
      const phone = { id: 123 };
      jest.spyOn(phoneFormService, 'getPhone').mockReturnValue(phone);
      jest.spyOn(phoneService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ phone });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: phone }));
      saveSubject.complete();

      // THEN
      expect(phoneFormService.getPhone).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(phoneService.update).toHaveBeenCalledWith(expect.objectContaining(phone));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPhone>>();
      const phone = { id: 123 };
      jest.spyOn(phoneFormService, 'getPhone').mockReturnValue({ id: null });
      jest.spyOn(phoneService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ phone: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: phone }));
      saveSubject.complete();

      // THEN
      expect(phoneFormService.getPhone).toHaveBeenCalled();
      expect(phoneService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPhone>>();
      const phone = { id: 123 };
      jest.spyOn(phoneService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ phone });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(phoneService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
