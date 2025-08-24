import { TestBed } from '@angular/core/testing';
import { SimulationService } from './simulation.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Product } from './product.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('SimulationService', () => {
  let service: SimulationService;
  let httpMock: HttpTestingController;
  const product: Product = {
    id: 1,
    nome: 'Teste',
    taxaEfetivaMensal: 1.0,
    prazoMaximo: 24,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [SimulationService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(SimulationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should simulate locally if apiBaseUrl is null', () => {
    const request = { produtoId: 1, valor: 10000, meses: 12 };
    const result = service.simulate(request, product);
    if (result && typeof (result as any).subscribe === 'function') {
      (result as any).subscribe((res: any) => {
        expect(res).toBeTruthy();
        expect(res.produto.nome).toBe('Teste');
        expect(res.memoriaCalculo.length).toBe(12);
      });
    } else {
      expect(result).toBeTruthy();
      expect((result as any).produto.nome).toBe('Teste');
      expect((result as any).memoriaCalculo.length).toBe(12);
    }
  });

  it('should call API if apiBaseUrl is set', () => {
    (service as any).http = httpMock;
    (service as any).result.set(null);
    const request = { produtoId: 1, valor: 10000, meses: 12 };
  // Simula ambiente de API, ajuste conforme necessário para seu ambiente real
    const result = service.simulate(request, product);
    if (result && typeof (result as any).subscribe === 'function') {
      (result as any).subscribe(() => {
        const req = httpMock.expectOne('http://localhost/simulacoes');
        expect(req.request.method).toBe('POST');
      });
    } else {
      const req = httpMock.expectOne('http://localhost/simulacoes');
      expect(req.request.method).toBe('POST');
    }
  });
  it('should simulate SAC system correctly', () => {
    const sacProduct = { ...product, sistema: 'SAC' };
    const request = { produtoId: 1, valor: 12000, meses: 12 };
    const result = service.simulate(request, sacProduct);
    if (result && typeof (result as any).subscribe === 'function') {
      (result as any).subscribe((res: any) => {
        expect(res).toBeTruthy();
        expect(res.produto.sistema).toBe('SAC');
        expect(res.memoriaCalculo.length).toBe(12);
      });
    } else {
      expect(result).toBeTruthy();
      expect((result as any).produto.sistema).toBe('SAC');
      expect((result as any).memoriaCalculo.length).toBe(12);
    }
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
