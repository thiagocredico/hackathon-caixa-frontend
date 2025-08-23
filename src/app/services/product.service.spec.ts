
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ProductService } from './product.service';
import { environment } from '../../environments/environment';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch products (mock)', () => {
    // Simula ambiente local sem API
    service.fetchProducts().subscribe((products: any) => {
      expect(products.length).toBeGreaterThan(0);
      expect(products[0].nome).toBeDefined();
    });
  });

  it('should add product (mock)', () => {
    // Simula ambiente local sem API
    const product = {
      nome: 'Teste',
      taxaEfetivaMensal: 0.8,
      prazoMaximo: 12
    };
    service.addProduct(product as any).subscribe((added: any) => {
      expect(added.nome).toBe('Teste');
      expect(added.taxaEfetivaMensal).toBe(0.8);
      expect(added.prazoMaximo).toBe(12);
      expect(added.id).toBeDefined();
    });
  });
  it('should set products', () => {
    const products = [
      { nome: 'Novo', taxaEfetivaMensal: 1, prazoMaximo: 10, id: 99 }
    ];
    service.setProducts(products as any);
    expect(service.products$().length).toBe(1);
    expect(service.products$()[0].nome).toBe('Novo');
  });

  it('should fetch products from API', () => {
    // Simula ambiente com API
    const originalApi = environment.apiBaseUrl;
  (environment as any).apiBaseUrl = 'http://localhost';
    service['http'].get = jasmine.createSpy().and.returnValue(of([{ nome: 'API', taxaEfetivaMensal: 1, prazoMaximo: 10 }]));
    service.fetchProducts().subscribe((products: any) => {
      expect(products.length).toBeGreaterThan(0);
    });
    environment.apiBaseUrl = originalApi;
  });

  it('should fetch products from API and handle error', () => {
    const originalApi = environment.apiBaseUrl;
  (environment as any).apiBaseUrl = 'http://localhost';
    service['http'].get = jasmine.createSpy().and.returnValue(throwError(() => new Error('fail')));
    service.fetchProducts().subscribe((products: any) => {
      expect(products).toEqual([]);
    });
    environment.apiBaseUrl = originalApi;
  });

  it('should fetch products locally if already loaded', () => {
    service.setProducts([{ nome: 'Local', taxaEfetivaMensal: 1, prazoMaximo: 10, id: 1 } as any]);
  (environment as any).apiBaseUrl = null;
    service.fetchProducts().subscribe((products: any) => {
      expect(products.length).toBe(1);
      expect(products[0].nome).toBe('Local');
    });
  });

  it('should add product and handle error (API)', () => {
    const originalApi = environment.apiBaseUrl;
  (environment as any).apiBaseUrl = 'http://localhost';
    service['http'].post = jasmine.createSpy().and.returnValue(throwError(() => new Error('fail')));
    service.addProduct({ nome: 'API', taxaEfetivaMensal: 1, prazoMaximo: 10 } as any).subscribe((added: any) => {
      expect(added.nome).toBe('API');
    });
    environment.apiBaseUrl = originalApi;
  });



  it('should add product with API', () => {
    (window as any).environment = { apiBaseUrl: 'http://localhost', endpoints: { produtos: '/produtos' } };
    service['http'].post = jasmine.createSpy().and.returnValue(of({ nome: 'API', taxaEfetivaMensal: 1, prazoMaximo: 10 }));
    service.addProduct({ nome: 'API', taxaEfetivaMensal: 1, prazoMaximo: 10 } as any).subscribe((added: any) => {
      expect(added.nome).toBe('API');
    });
  });

  it('should handle error in addProduct local branch', (done) => {
    (environment as any).apiBaseUrl = null;
    // Mock products.set para lançar erro
    const originalSet = (service as any).products.set;
    (service as any).products.set = () => { throw new Error('fail'); };
    const fallbackProduct = { nome: 'Erro', taxaEfetivaMensal: 1, prazoMaximo: 10 };
    service.addProduct(fallbackProduct as any).subscribe({
      next: (added: any) => {
        // O catchError retorna o fallback
        expect(added).toEqual(fallbackProduct);
        (service as any).products.set = originalSet;
        done();
      },
      error: (err: any) => {
        // Não deve cair aqui, pois o catchError trata
        (service as any).products.set = originalSet;
        fail('Should not throw error');
        done();
      }
    });
  });

  it('should handle error gracefully', () => {
    const handle = service['handleError']('test', []);
    const result = handle(new Error('fail'));
    expect(result).toBeDefined();
  });
});
