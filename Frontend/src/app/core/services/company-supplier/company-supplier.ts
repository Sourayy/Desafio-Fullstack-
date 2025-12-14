import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment/enviroment';
import { HttpClient } from '@angular/common/http';
import { ISupplier } from '../../interface/supplier.interface';

@Injectable({ providedIn: 'root' })
export class CompanySupplierService {
  private _apiUrl = `${environment.apiUrl}/CompanySupplier`;
  private _http = inject(HttpClient);

  getSuppliersByCompany(companyId: number) {
    return this._http.get<ISupplier[]>(`${this._apiUrl}/company/${companyId}`);
  }

  addSupplierToCompany(companyId: number, supplierId: number) {
    return this._http.post(`${this._apiUrl}`, { companyId, supplierId }, { responseType: 'text' });
  }

  removeSupplierFromCompany(companyId: number, supplierId: number) {
    return this._http.request('delete', `${this._apiUrl}`, {
      body: { companyId, supplierId },
      responseType: 'text',
    });
  }
}
