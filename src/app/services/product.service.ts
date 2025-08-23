import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Product {
  id?: number;
  nome: string;
  taxaEfetivaMensal: number;
  prazoMaximo: number;
  sistema?: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private products = signal<Product[]>([]);
  products$ = computed(() => this.products());

  constructor(private http: HttpClient) {}

  private nextId = 2;

  fetchProducts(): Observable<Product[]> {
    if (!environment.apiBaseUrl) {
      if (this.products().length === 0) {
        const mockProducts: Product[] = [
          {
            id: 1,
            nome: 'Empréstimo Pessoal PRICE',
            taxaEfetivaMensal: 1.39, // taxa mensal
            prazoMaximo: 12,
            sistema: 'PRICE',
          },
          {
            id: 2,
            nome: 'Financiamento de Imóveis PRICE',
            taxaEfetivaMensal: 1.05, // exemplo de taxa mensal
            prazoMaximo: 360,
            sistema: 'PRICE',
          },
          {
            id: 3,
            nome: 'Financiamento de Veículos SAC',
            taxaEfetivaMensal: 1.25, // exemplo de taxa mensal
            prazoMaximo: 48,
            sistema: 'SAC',
          },
          {
            id: 4,
            nome: 'Empréstimo Consignado SAC',
            taxaEfetivaMensal: 1.5, // exemplo de taxa mensal
            prazoMaximo: 18,
            sistema: 'SAC',
          },
        ];
        this.products.set(mockProducts);
        return of(mockProducts).pipe(
          catchError(this.handleError<Product[]>('fetchProducts', []))
        );
      } else {
        return of(this.products()).pipe(
          catchError(this.handleError<Product[]>('fetchProducts', []))
        );
      }
    } else {
      const url = `${environment.apiBaseUrl}${environment.endpoints.produtos}`;
      return this.http.get<Product[]>(url).pipe(
        catchError(this.handleError<Product[]>('fetchProducts', []))
      );
    }
  }

  addProduct(product: Product): Observable<Product> {
    if (!environment.apiBaseUrl) {
      try {
        const newProduct = { ...product, id: ++this.nextId };
        const updated = [...this.products(), newProduct];
        this.products.set(updated);
        return of(newProduct);
      } catch (error) {
        console.error('Erro em addProduct:', error);
        return of(product);
      }
    } else {
      const url = `${environment.apiBaseUrl}${environment.endpoints.produtos}`;
      return this.http.post<Product>(url, product).pipe(
        catchError(this.handleError<Product>('addProduct', product))
      );
    }
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`Erro em ${operation}:`, error);
      return of(result as T);
    };
  }

  setProducts(products: Product[]) {
    this.products.set(products);
  }
}
