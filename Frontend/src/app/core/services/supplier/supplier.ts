import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/enviroment';
import { ISupplier } from '../../interface/supplier.interface';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private _apiUrl = `${environment.apiUrl}/Suppliers`;
  private _http = inject(HttpClient);

  getSuppliers(filters?: { name?: string; document?: string }): Observable<ISupplier[]> {
    let params: any = {};

    if (filters?.name) {
      params.name = filters.name;
    }

    if (filters?.document) {
      params.document = filters.document;
    }

    return this._http.get<ISupplier[]>(this._apiUrl, { params });
  }

  createSupplier(supplier: ISupplier): Observable<ISupplier> {
    return this._http.post<ISupplier>(this._apiUrl, supplier);
  }

  updateSupplier(id: number, supplier: ISupplier): Observable<ISupplier> {
    return this._http.put<ISupplier>(`${this._apiUrl}/${id}`, supplier);
  }

  deleteSupplier(id: number): Observable<any> {
    return this._http.delete(`${this._apiUrl}/${id}`, { responseType: 'text' });
  }
}
