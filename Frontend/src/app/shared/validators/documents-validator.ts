import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentsValidator {
  private _http = inject(HttpClient);

  isValidCPF(cpf: string): boolean {
    cpf = cpf.replace(/\D/g, '');
    if (!cpf || cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i);
    let rev = 11 - (sum % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpf.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (sum % 11);
    if (rev === 10 || rev === 11) rev = 0;
    return rev === parseInt(cpf.charAt(10));
  }

  isValidCNPJ(cnpj: string): boolean {
    cnpj = cnpj.replace(/\D/g, '');
    if (!cnpj || cnpj.length !== 14) return false;

    const calc = (x: number) => {
      let size = x === 12 ? 12 : 13;
      let numbers = cnpj.substring(0, size);
      let digits = cnpj.substring(size);
      let sum = 0;
      let pos = size - 7;
      for (let i = size; i >= 1; i--) {
        sum += parseInt(numbers.charAt(size - i)) * pos--;
        if (pos < 2) pos = 9;
      }
      let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
      return result === parseInt(digits.charAt(0));
    };

    return calc(12) && calc(13);
  }

  isValidRG(rg: string): boolean {
    rg = rg.replace(/\D/g, '');
    return rg.length >= 7 && rg.length <= 9;
  }

  isValidCEPFormat(cep: string): boolean {
    return /^[0-9]{5}-?[0-9]{3}$/.test(cep);
  }

  async isValidCEP(cep: string): Promise<boolean> {
    cep = cep.replace(/\D/g, '');
    if (!this.isValidCEPFormat(cep)) return false;

    try {
      const res: any = await firstValueFrom(
        this._http.get(`https://viacep.com.br/ws/${cep}/json/`)
      );
      return !res.erro;
    } catch {
      return false;
    }
  }
}
