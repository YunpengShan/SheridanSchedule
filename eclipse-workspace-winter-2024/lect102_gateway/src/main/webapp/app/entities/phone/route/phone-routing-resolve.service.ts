import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPhone } from '../phone.model';
import { PhoneService } from '../service/phone.service';

export const phoneResolve = (route: ActivatedRouteSnapshot): Observable<null | IPhone> => {
  const id = route.params['id'];
  if (id) {
    return inject(PhoneService)
      .find(id)
      .pipe(
        mergeMap((phone: HttpResponse<IPhone>) => {
          if (phone.body) {
            return of(phone.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default phoneResolve;
