import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICompany } from '../../interface/company.interface';
import { environment } from '../../environment/enviroment';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private _apiUrl = `${environment.apiUrl}/Companies`;
  private _http = inject(HttpClient);

  getCompanies(filters?: { name?: string; cnpj?: string }): Observable<ICompany[]> {
    let params: any = {};

    if (filters?.name) {
      params.name = filters.name;
    }

    if (filters?.cnpj) {
      params.cnpj = filters.cnpj;
    }

    return this._http.get<ICompany[]>(this._apiUrl, { params });
  }

  createCompany(company: ICompany): Observable<ICompany> {
    return this._http.post<ICompany>(this._apiUrl, company);
  }

  updateCompany(id: number, company: ICompany): Observable<ICompany> {
    return this._http.put<ICompany>(`${this._apiUrl}/${id}`, company);
  }

  deleteCompany(id: number): Observable<any> {
    return this._http.delete(`${this._apiUrl}/${id}`, { responseType: 'text' });
  }
}
