import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { PhoneComponent } from './list/phone.component';
import { PhoneDetailComponent } from './detail/phone-detail.component';
import { PhoneUpdateComponent } from './update/phone-update.component';
import PhoneResolve from './route/phone-routing-resolve.service';

const phoneRoute: Routes = [
  {
    path: '',
    component: PhoneComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PhoneDetailComponent,
    resolve: {
      phone: PhoneResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PhoneUpdateComponent,
    resolve: {
      phone: PhoneResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PhoneUpdateComponent,
    resolve: {
      phone: PhoneResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default phoneRoute;
