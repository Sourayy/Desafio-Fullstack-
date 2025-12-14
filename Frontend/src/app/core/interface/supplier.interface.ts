export interface ISupplier {
  id?: number;
  document: string;
  name: string;
  email: string;
  cep: string;
  uf?: string;
  city?: string;
  neighborhood?: string;
  street?: string;
  rg?: string;
  birthDate?: string;
}
