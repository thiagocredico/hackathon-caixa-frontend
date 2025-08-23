import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Product } from './product.service';
import { delay, of, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface SimulationRequest {
  produtoId: number;
  valor: number;
  meses: number;
}

export interface SimulationResult {
  produto: Product;
  taxaEfetivaMensal: number;
  parcelaMensal: number;
  valorTotalComJuros: number;
  memoriaCalculo: Array<{
    mes: number;
    juros: number;
    amortizacao: number;
    saldo: number;
  }>;
}

@Injectable({ providedIn: 'root' })
export class SimulationService {
  private result = signal<SimulationResult | null>(null);
  result$ = computed(() => this.result());

  constructor(private http: HttpClient) {}


  simulate(request: SimulationRequest, produto: Product): Observable<SimulationResult | null> {
    if (!environment.apiBaseUrl) {
      const taxaMensal = produto.taxaEfetivaMensal / 100;
      let parcela = 0;
      let memoriaCalculo = [];
      let valorTotalComJuros = 0;
      if (produto.sistema === 'SAC') {
        // Sistema SAC: amortização constante
        const amortizacaoConstante = Math.round((request.valor / request.meses) * 100) / 100;
        let saldo = request.valor;
        memoriaCalculo = [];
        for (let mes = 1; mes <= request.meses; mes++) {
          const juros = Math.round(saldo * taxaMensal * 100) / 100;
          const parcelaMes = Math.round((amortizacaoConstante + juros) * 100) / 100;
          saldo = Math.round((saldo - amortizacaoConstante) * 100) / 100;
          memoriaCalculo.push({
            mes,
            juros,
            amortizacao: amortizacaoConstante,
            saldo: Math.max(saldo, 0),
            parcela: parcelaMes
          });
        }
        valorTotalComJuros = Math.round(memoriaCalculo.reduce((acc, m) => acc + m.parcela, 0) * 100) / 100;
        parcela = memoriaCalculo[0].parcela; // Primeira parcela
      } else {
        // Price (padrão)
        parcela =
          request.valor *
          (taxaMensal / (1 - Math.pow(1 + taxaMensal, -request.meses)));
        parcela = Math.round(parcela * 100) / 100;
        let saldo = request.valor;
        memoriaCalculo = [];
        for (let mes = 1; mes <= request.meses; mes++) {
          const juros = Math.round(saldo * taxaMensal * 100) / 100;
          const amortizacao = Math.round((parcela - juros) * 100) / 100;
          saldo = Math.round((saldo - amortizacao) * 100) / 100;
          memoriaCalculo.push({
            mes,
            juros,
            amortizacao,
            saldo: Math.max(saldo, 0),
          });
        }
        valorTotalComJuros = Math.round(parcela * request.meses * 100) / 100;
      }
      const result: SimulationResult = {
        produto,
        taxaEfetivaMensal: Math.round(taxaMensal * 10000) / 100,
        parcelaMensal: parcela,
        valorTotalComJuros,
        memoriaCalculo,
      };
      return of(result).pipe(
        delay(2000),
        catchError(this.handleError<SimulationResult | null>('simulate', null))
      );
    } else {
      const url = `${environment.apiBaseUrl}${environment.endpoints.simulacoes}`;
      return this.http.post<SimulationResult>(url, request).pipe(
        catchError(this.handleError<SimulationResult | null>('simulate', null))
      );
    }
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`Erro em ${operation}:`, error);
      return of(result as T);
    };
  }

  setResult(result: SimulationResult) {
    this.result.set(result);
  }
}
