import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'student',
    data: { pageTitle: 'gatewayApp.student.home.title' },
    loadChildren: () => import('./student/student.routes'),
  },
  {
    path: 'address',
    data: { pageTitle: 'gatewayApp.address.home.title' },
    loadChildren: () => import('./address/address.routes'),
  },
  {
    path: 'phone',
    data: { pageTitle: 'gatewayApp.phone.home.title' },
    loadChildren: () => import('./phone/phone.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
