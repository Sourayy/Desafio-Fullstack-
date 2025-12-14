import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMaskDirective } from 'ngx-mask';
import { SupplierService } from '../../../core/services/supplier/supplier';
import { ISupplier } from '../../../core/interface/supplier.interface';
import { DocumentsValidator } from '../../../shared/validators/documents-validator';

@Component({
  selector: 'app-supplier-modal',
  standalone: true,
  imports: [
    NgxMaskDirective,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
  ],
  templateUrl: './supplier-modal.html',
  styleUrl: './supplier-modal.scss',
})
export class SupplierModal {
  private dialogRef = inject(MatDialogRef<SupplierModal>);
  private supplierService = inject(SupplierService);
  private documentsValidatorService = inject(DocumentsValidator);
  private data = inject<ISupplier | null>(MAT_DIALOG_DATA, { optional: true });

  isEdit = signal<boolean>(false);
  isCPF = signal<boolean>(false);

  cpfCnpjValid = signal(true);
  rgValid = signal(true);
  cepValid = signal(true);

  supplier: ISupplier = {
    document: '',
    name: '',
    email: '',
    cep: '',
  };

  constructor() {
    if (this.data) {
      this.isEdit.set(true);
      this.supplier = { ...this.data };

      if (this.supplier.document.length === 11) {
        this.isCPF.set(true);
      }
    }
  }

  private normalizeBirthDate() {
    if (this.supplier.birthDate) {
      const bd = this.supplier.birthDate.replace(/\D/g, '');
      if (bd.length === 8) {
        this.supplier.birthDate = `${bd.substring(0, 2)}/${bd.substring(2, 4)}/${bd.substring(
          4,
          8
        )}`;
      }
    }
  }

  save() {
    if (this.isCPF()) {
      this.normalizeBirthDate();
    }

    if (this.isEdit()) {
      this.update();
    } else {
      this.create();
    }
  }

  onDocumentBlur() {
    const doc = (this.supplier.document || '').replace(/\D/g, '').trim() || '';

    this.isCPF.set(doc.length === 11);

    if (this.isCPF()) {
      this.cpfCnpjValid.set(this.documentsValidatorService.isValidCPF(doc));
    } else {
      this.cpfCnpjValid.set(this.documentsValidatorService.isValidCNPJ(doc));
    }

    if (!this.isCPF()) {
      this.supplier.rg = undefined;
      this.supplier.birthDate = undefined;
    }
  }

  onRGBlur() {
    if (this.supplier.rg) {
      const rg = this.supplier.rg.replace(/\D/g, '');
      this.rgValid.set(this.documentsValidatorService.isValidRG(rg));
    }
  }

  async onCEPBlur() {
    const cep = (this.supplier.cep || '').replace(/\D/g, '').trim() || '';
    this.cepValid.set(false);

    if (cep) {
      const valid = await this.documentsValidatorService.isValidCEP(cep);
      this.cepValid.set(valid);
    }
  }

  private create() {
    this.supplierService.createSupplier(this.supplier).subscribe({
      next: (created) => this.dialogRef.close(created),
      error: (err) => console.error(err),
    });
  }

  private update() {
    this.supplierService.updateSupplier(this.supplier.id!, this.supplier).subscribe({
      next: (updated) => this.dialogRef.close(updated),
      error: (err) => console.error(err),
    });
  }
}
