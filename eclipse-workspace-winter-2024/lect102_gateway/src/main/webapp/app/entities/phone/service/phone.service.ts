import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPhone, NewPhone } from '../phone.model';

export type PartialUpdatePhone = Partial<IPhone> & Pick<IPhone, 'id'>;

export type EntityResponseType = HttpResponse<IPhone>;
export type EntityArrayResponseType = HttpResponse<IPhone[]>;

@Injectable({ providedIn: 'root' })
export class PhoneService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/phones');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(phone: NewPhone): Observable<EntityResponseType> {
    return this.http.post<IPhone>(this.resourceUrl, phone, { observe: 'response' });
  }

  update(phone: IPhone): Observable<EntityResponseType> {
    return this.http.put<IPhone>(`${this.resourceUrl}/${this.getPhoneIdentifier(phone)}`, phone, { observe: 'response' });
  }

  partialUpdate(phone: PartialUpdatePhone): Observable<EntityResponseType> {
    return this.http.patch<IPhone>(`${this.resourceUrl}/${this.getPhoneIdentifier(phone)}`, phone, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPhone>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPhone[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPhoneIdentifier(phone: Pick<IPhone, 'id'>): number {
    return phone.id;
  }

  comparePhone(o1: Pick<IPhone, 'id'> | null, o2: Pick<IPhone, 'id'> | null): boolean {
    return o1 && o2 ? this.getPhoneIdentifier(o1) === this.getPhoneIdentifier(o2) : o1 === o2;
  }

  addPhoneToCollectionIfMissing<Type extends Pick<IPhone, 'id'>>(
    phoneCollection: Type[],
    ...phonesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const phones: Type[] = phonesToCheck.filter(isPresent);
    if (phones.length > 0) {
      const phoneCollectionIdentifiers = phoneCollection.map(phoneItem => this.getPhoneIdentifier(phoneItem)!);
      const phonesToAdd = phones.filter(phoneItem => {
        const phoneIdentifier = this.getPhoneIdentifier(phoneItem);
        if (phoneCollectionIdentifiers.includes(phoneIdentifier)) {
          return false;
        }
        phoneCollectionIdentifiers.push(phoneIdentifier);
        return true;
      });
      return [...phonesToAdd, ...phoneCollection];
    }
    return phoneCollection;
  }
}
