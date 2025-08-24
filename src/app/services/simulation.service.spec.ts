import { TestBed } from '@angular/core/testing';
import { SimulationService } from './simulation.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Product } from './product.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { environment } from '../../environments/environment';

describe('SimulationService', () => {
  let service: SimulationService;
  let httpMock: HttpTestingController;
  const product: Product = {
    id: 1,
    nome: 'Teste',
    taxaEfetivaMensal: 1.0,
    prazoMaximo: 24,
  };

  let originalApiBaseUrl: string | null;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [SimulationService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    });
    service = TestBed.inject(SimulationService);
    httpMock = TestBed.inject(HttpTestingController);
    originalApiBaseUrl = environment.apiBaseUrl;
  });

  afterEach(() => {
    environment.apiBaseUrl = originalApiBaseUrl;
    httpMock.verify();
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return null if request is null', (done) => {
    service.simulate(null as any, product).subscribe((res) => {
      expect(res).toBeNull();
      done();
    });
  });

  it('should return null if product is null', (done) => {
    const request = { produtoId: 1, valor: 10000, meses: 12 };
    service.simulate(request, null as any).subscribe((res) => {
      expect(res).toBeNull();
      done();
    });
  });



  it('should simulate locally if apiBaseUrl is null (Price system)', (done) => {
    environment.apiBaseUrl = null;
    const priceProduct = { ...product, sistema: 'PRICE', taxaEfetivaMensal: 1.0 };
    const request = { produtoId: 1, valor: 10000, meses: 12 };
    const result = service.simulate(request, priceProduct);
    (result as any).subscribe((res: any) => {
      expect(res).toBeTruthy();
      expect(res.produto.sistema).toBe('PRICE');
      expect(res.memoriaCalculo.length).toBe(12);
      done();
    });
  });


  it('should simulate locally with edge values', (done) => {
    environment.apiBaseUrl = null;
    const priceProduct = { ...product, sistema: 'PRICE', taxaEfetivaMensal: 1.0 };
    const request = { produtoId: 1, valor: 0, meses: 1 };
    const result = service.simulate(request, priceProduct);
    (result as any).subscribe((res: any) => {
      expect(res).toBeTruthy();
      expect(res.memoriaCalculo.length).toBe(1);
      expect(res.parcelaMensal).toBe(0);
      done();
    });
  });


  it('should call API if apiBaseUrl is set', (done) => {
    environment.apiBaseUrl = 'http://localhost';
    const request = { produtoId: 1, valor: 10000, meses: 12 };
    // Subscribe first so HttpClient issues the request, then assert using HttpTestingController
    const result$ = service.simulate(request, product);
    result$.subscribe(() => {
      expect().nothing();
      done();
    });
    const req = httpMock.expectOne('http://localhost/simulacoes');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should handle error on API call', (done) => {
    const originalApiBaseUrl = environment.apiBaseUrl;
    environment.apiBaseUrl = 'http://localhost';
    const request = { produtoId: 1, valor: 10000, meses: 12 };
    const result = service.simulate(request, product);
    (result as any).subscribe((res: any) => {
      expect(res).toBeNull();
      environment.apiBaseUrl = originalApiBaseUrl;
      done();
    });
    const req = httpMock.expectOne('http://localhost/simulacoes');
    req.error(new ErrorEvent('Network error'));
  });

  it('should simulate SAC system correctly', (done) => {
    environment.apiBaseUrl = null;
    const sacProduct = { ...product, sistema: 'SAC' };
    const request = { produtoId: 1, valor: 12000, meses: 12 };
    const result = service.simulate(request, sacProduct);
    (result as any).subscribe((res: any) => {
      expect(res).toBeTruthy();
      expect(res.produto.sistema).toBe('SAC');
      expect(res.memoriaCalculo.length).toBe(12);
      done();
    });
  });

  it('should handle error gracefully', (done) => {
    const handle = service['handleError']('test', null);
    const result = handle(new Error('fail'));
    if (result && typeof result.subscribe === 'function') {
      result.subscribe((val: any) => {
        expect(val).toBeNull();
        done();
      });
    } else {
      expect(result === null || result === undefined).toBe(true);
      done();
    }
  });
});
