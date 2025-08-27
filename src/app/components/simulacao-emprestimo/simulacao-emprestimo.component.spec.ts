import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimulacaoEmprestimoComponent } from './simulacao-emprestimo.component';
import { ProductService } from '../../services/product.service';
import { SimulationService } from '../../services/simulation.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError, BehaviorSubject } from 'rxjs';

describe('SimulacaoEmprestimoComponent', () => {
	let component: SimulacaoEmprestimoComponent;
	let fixture: ComponentFixture<SimulacaoEmprestimoComponent>;
	let productServiceMock: any;
	let simulationServiceMock: any;
	let routerMock: any;
	let queryParams$: BehaviorSubject<any>;
	let productsArray: any[];

	beforeEach(async () => {
		queryParams$ = new BehaviorSubject({});
		productsArray = [];
		productServiceMock = {
			products$: () => productsArray,
			fetchProducts: jasmine.createSpy('fetchProducts').and.returnValue(of([])),
			setProducts: jasmine.createSpy('setProducts')
		};
		simulationServiceMock = {
			simulate: jasmine.createSpy('simulate'),
			setResult: jasmine.createSpy('setResult')
		};
		routerMock = jasmine.createSpyObj('Router', ['navigate']);

		await TestBed.configureTestingModule({
			imports: [SimulacaoEmprestimoComponent],
			providers: [
				{ provide: ProductService, useValue: productServiceMock },
				{ provide: SimulationService, useValue: simulationServiceMock },
				{ provide: Router, useValue: routerMock },
				{ provide: ActivatedRoute, useValue: { queryParams: queryParams$.asObservable() } }
			]
		}).compileComponents();

		fixture = TestBed.createComponent(SimulacaoEmprestimoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should set error when no product selected', () => {
		// ensure products$ returns empty list
		(productServiceMock as any).products$ = () => [];
		component.produtoId.set(999);
		component.simulate();
		expect(component.errorMsg()).toBe('Selecione um produto válido.');
		expect(component.loading()).toBe(false);
	});

	it('should handle simulate returning null', () => {
	 	const prod = { id: 1, nome: 'P', taxaEfetivaMensal: 1, prazoMaximo: 12 };
	 	productsArray.length = 0; productsArray.push(prod);
		component.produtoId.set(1);
		simulationServiceMock.simulate.and.returnValue(of(null));
		component.simulate();
		expect(component.errorMsg()).toBe('Erro ao simular. Tente novamente.');
		expect(component.loading()).toBe(false);
	});

	it('should navigate to resultado when simulate returns result', () => {
	 	const prod = { id: 1, nome: 'P', taxaEfetivaMensal: 1, prazoMaximo: 12 };
	 	const result = { produto: prod } as any;
	 	productsArray.length = 0; productsArray.push(prod);
	 	component.produtoId.set(1);
	 	simulationServiceMock.simulate.and.returnValue(of(result));
	 	component.simulate();
	 	expect(simulationServiceMock.setResult).toHaveBeenCalledWith(result);
	 	expect(routerMock.navigate).toHaveBeenCalledWith(['/resultado']);
	});

	it('should set error when simulate errors', () => {
	 	const prod = { id: 1, nome: 'P', taxaEfetivaMensal: 1, prazoMaximo: 12 };
	 	productsArray.length = 0; productsArray.push(prod);
		component.produtoId.set(1);
		simulationServiceMock.simulate.and.returnValue(throwError(() => new Error('fail')));
		component.simulate();
		expect(component.errorMsg()).toBe('Erro ao simular. Tente novamente.');
		expect(component.loading()).toBe(false);
	});

	it('should navigate to cadastro produto when irParaCadastroProduto called', () => {
		component.irParaCadastroProduto();
		expect(routerMock.navigate).toHaveBeenCalledWith(['/novo-produto']);
	});

	it('constructor should set errorMsg when fetchProducts errors', () => {
		// create a fresh mock that errors on fetchProducts
		const productServiceErrorMock: any = {
			products$: () => [],
			fetchProducts: jasmine.createSpy('fetchProducts').and.returnValue(throwError(() => new Error('fail'))),
			setProducts: jasmine.createSpy('setProducts')
		};
		const simMock: any = { simulate: jasmine.createSpy('simulate'), setResult: jasmine.createSpy('setResult') };
		const router = jasmine.createSpyObj('Router', ['navigate']);
		// instantiate directly to exercise constructor behavior
		const CompClass: any = SimulacaoEmprestimoComponent as any;
		const comp = new CompClass(
			productServiceErrorMock,
			simMock,
			router,
			{ queryParams: of({}) } as any
		);
		expect(comp.errorMsg()).toBe('Erro ao buscar produtos.');
	});

	it('should set produtoId when queryParams contains produtoId', () => {
		// push a value into the behavior subject used by the testbed
		(queryParams$ as BehaviorSubject<any>).next({ produtoId: '7' });
		expect(component.produtoId()).toBe(7);
	});
});
