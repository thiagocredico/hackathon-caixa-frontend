import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormularioProdutoComponent } from './formulario-produto.component';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('FormularioProdutoComponent', () => {
	let component: FormularioProdutoComponent;
	let fixture: ComponentFixture<FormularioProdutoComponent>;
	let productServiceSpy: any;
	let routerSpy: any;

	beforeEach(async () => {
		const productServiceMock = jasmine.createSpyObj('ProductService', ['addProduct']);
		const routerMock = jasmine.createSpyObj('Router', ['navigate']);

		await TestBed.configureTestingModule({
			imports: [FormularioProdutoComponent],
			providers: [
				{ provide: ProductService, useValue: productServiceMock },
				{ provide: Router, useValue: routerMock },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(FormularioProdutoComponent);
		component = fixture.componentInstance;
		productServiceSpy = TestBed.inject(ProductService) as any;
		routerSpy = TestBed.inject(Router) as any;
	});

	it('deve criar o componente', () => {
		expect(component).toBeTruthy();
	});

		it('deve exibir erro se campos obrigatórios não forem preenchidos', () => {
			component.nome.set('');
			component.taxaEfetivaAnual.set(0);
			component.prazoMaximo.set(0);
			component.sistema.set('');
			component.submit();
			expect(component.errorMsg()).toBe('Preencha todos os campos corretamente.');
		});

		it('deve cadastrar produto e redirecionar para /produtos', fakeAsync(() => {
			component.nome.set('Produto Teste');
			component.taxaEfetivaAnual.set(10);
			component.prazoMaximo.set(12);
			productServiceSpy.addProduct.and.returnValue(of({
				nome: 'Produto Teste',
				taxaEfetivaMensal: (Math.pow(1 + 10 / 100, 1 / 12) - 1) * 100,
				prazoMaximo: 12,
				id: 1
			}));
			component.submit();
			expect(component.loading()).toBe(false);
			expect(component.successMsg()).toBe('Produto adicionado com sucesso!');
			tick(800);
			expect(routerSpy.navigate).toHaveBeenCalledWith(['/produtos']);
		}));

	it('deve exibir erro ao falhar no cadastro', () => {
		component.nome.set('Produto Teste');
		component.taxaEfetivaAnual.set(10);
		component.prazoMaximo.set(12);
		component.sistema.set('PRICE');
		productServiceSpy.addProduct.and.returnValue(throwError(() => new Error('Erro')));
		component.submit();
		expect(component.loading()).toBe(false);
		expect(component.errorMsg()).toBe('Erro ao adicionar produto. Tente novamente.');
	});
	it('deve navegar para /simulacao ao chamar irParaSimulacao', () => {
		component.irParaSimulacao();
		expect(routerSpy.navigate).toHaveBeenCalledWith(['/simulacao']);
	});
});
