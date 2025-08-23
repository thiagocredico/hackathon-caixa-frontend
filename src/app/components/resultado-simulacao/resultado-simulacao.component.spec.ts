import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ResultadoSimulacaoComponent } from './resultado-simulacao.component';
import { SimulationService } from '../../services/simulation.service';
import { of } from 'rxjs';

describe('ResultadoSimulacaoComponent', () => {
	let component: ResultadoSimulacaoComponent;
	let fixture: ComponentFixture<ResultadoSimulacaoComponent>;
	let simulationServiceMock: any;

	beforeEach(async () => {
		simulationServiceMock = {
			// result$ como função que retorna o objeto direto (simulando signal)
			result$: () => ({
				produto: {
					id: 1,
					nome: 'Produto Teste',
					sistema: 'PRICE',
					taxaEfetivaMensal: 1.5,
					prazoMaximo: 12
				},
				taxaEfetivaMensal: 1.5,
				parcelaMensal: 100,
				valorTotalComJuros: 1200,
				memoriaCalculo: [
					{ mes: 1, juros: 10, amortizacao: 90, saldo: 910 },
					{ mes: 2, juros: 9.1, amortizacao: 90.9, saldo: 819.1 }
				]
			})
		};

		await TestBed.configureTestingModule({
			imports: [ResultadoSimulacaoComponent],
			providers: [
				{ provide: SimulationService, useValue: simulationServiceMock }
			]
		}).compileComponents();

		fixture = TestBed.createComponent(ResultadoSimulacaoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should call salvarResultado and set successMsg', fakeAsync(() => {
		component.salvarResultado();
		expect(component.loading).toBe(true);
		tick(1200);
		expect(component.loading).toBe(false);
		expect(component.successMsg).toBe('Resultado salvo com sucesso!');
	}));

	it('should call exportToPDF and set successMsg', fakeAsync(() => {
		component.exportToPDF();
		expect(component.loading).toBe(true);
		tick(1200);
		expect(component.loading).toBe(false);
		expect(component.successMsg).toBe('PDF exportado com sucesso!');
	}));

	it('should call voltar and go back in history', () => {
		const spy = spyOn(window.history, 'back');
		component.voltar();
		expect(spy).toHaveBeenCalled();
	});
});
