import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PhoneDetailComponent } from './phone-detail.component';

describe('Phone Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhoneDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: PhoneDetailComponent,
              resolve: { phone: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(PhoneDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load phone on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', PhoneDetailComponent);

      // THEN
      expect(instance.phone).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
