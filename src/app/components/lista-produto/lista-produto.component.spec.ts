import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaProdutoComponent } from './lista-produto.component';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('ListaProdutoComponent', () => {
	let component: ListaProdutoComponent;
	let fixture: ComponentFixture<ListaProdutoComponent>;
	let productServiceSpy: any;
	let routerSpy: any;

	beforeEach(async () => {
		const productServiceMock: any = jasmine.createSpyObj('ProductService', ['fetchProducts', 'setProducts']);
		productServiceMock.products$ = of([
			{ id: 1, nome: 'Produto 1', taxaEfetivaMensal: 0.8, prazoMaximo: 12, sistema: 'PRICE' },
			{ id: 2, nome: 'Produto 2', taxaEfetivaMensal: 1.0, prazoMaximo: 24, sistema: 'SAC' },
		]);
		productServiceMock.fetchProducts.and.returnValue(of([
			{ id: 1, nome: 'Produto 1', taxaEfetivaMensal: 0.8, prazoMaximo: 12, sistema: 'PRICE' },
			{ id: 2, nome: 'Produto 2', taxaEfetivaMensal: 1.0, prazoMaximo: 24, sistema: 'SAC' },
		]));
		const routerMock = jasmine.createSpyObj('Router', ['navigate']);

		await TestBed.configureTestingModule({
			imports: [ListaProdutoComponent],
			providers: [
				{ provide: ProductService, useValue: productServiceMock },
				{ provide: Router, useValue: routerMock },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(ListaProdutoComponent);
		component = fixture.componentInstance;
		productServiceSpy = TestBed.inject(ProductService) as any;
		routerSpy = TestBed.inject(Router) as any;
	});

	it('deve criar o componente', () => {
		expect(component).toBeTruthy();
	});

	it('deve carregar produtos ao inicializar', () => {
		expect(productServiceSpy.fetchProducts).toHaveBeenCalled();
		expect(component.loading).toBe(false);
	});

	it('deve exibir erro ao falhar no carregamento', () => {
		productServiceSpy.fetchProducts.and.returnValue(throwError(() => new Error('Erro')));
		fixture = TestBed.createComponent(ListaProdutoComponent);
		component = fixture.componentInstance;
		expect(component.errorMsg).toBe('Erro ao carregar produtos.');
		expect(component.loading).toBe(false);
	});

	it('deve navegar para simulação ao clicar em um produto', () => {
		component.simularComProduto(2);
		expect(routerSpy.navigate).toHaveBeenCalledWith(['/simulacao'], { queryParams: { produtoId: 2 } });
	});
	it('deve calcular a taxa efetiva anual corretamente', () => {
		const taxaMensal = 2;
		const resultado = component.calcularTaxaEfetivaAnual(taxaMensal);
		expect(resultado).toBeCloseTo(26.82, 1);
	});
});
