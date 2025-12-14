import { Component, inject, signal } from '@angular/core';
import { CompanyService } from '../../../core/services/company/company';
import { ICompany } from '../../../core/interface/company.interface';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DocumentsValidator } from '../../../shared/validators/documents-validator';

@Component({
  selector: 'app-company-modal',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule],
  templateUrl: './company-modal.html',
  styleUrl: './company-modal.scss',
})
export class CompanyModal {
  private dialogRef = inject(MatDialogRef<CompanyModal>);
  private companyService = inject(CompanyService);
  private validator = inject(DocumentsValidator);
  private data = inject<ICompany | null>(MAT_DIALOG_DATA, { optional: true });

  isEdit = false;

  company: ICompany = {
    cnpj: '',
    fantasyName: '',
    cep: '',
  };

  cnpjValid = signal(true);
  cepValid = signal(true);

  constructor() {
    if (this.data) {
      this.isEdit = true;
      this.company = { ...this.data };
    }
  }

  save() {
    if (this.isEdit) {
      this.update();
    } else {
      this.create();
    }
  }

  onCNPJBlur() {
    const cnpj = this.company.cnpj?.trim() || '';
    this.cnpjValid.set(this.validator.isValidCNPJ(cnpj));
  }

  async onCEPBlur() {
    const cep = this.company.cep?.trim() || '';
    if (!cep) {
      this.cepValid.set(false);
      return;
    }
    this.cepValid.set(await this.validator.isValidCEP(cep));
  }

  private create() {
    this.companyService.createCompany(this.company).subscribe({
      next: (created) => this.dialogRef.close(created),
      error: (err) => console.error(err),
    });
  }

  private update() {
    this.companyService.updateCompany(this.company.id!, this.company).subscribe({
      next: (updated) => this.dialogRef.close(updated),
      error: (err) => console.error(err),
    });
  }
}
