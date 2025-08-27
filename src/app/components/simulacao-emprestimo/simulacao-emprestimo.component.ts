import { Component, signal, ChangeDetectionStrategy } from '@angular/core';

import { SimulationService, SimulationRequest } from '../../services/simulation.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
@Component({
    selector: 'app-simulacao-emprestimo',
    templateUrl: './simulacao-emprestimo.component.html',
    
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
	MatIconModule,
    MatProgressSpinnerModule
]
})
export class SimulacaoEmprestimoComponent {
	valor = signal<number>(0);
	meses = signal<number>(1);
	produtoId = signal<number | null>(null);
	loading = signal<boolean>(false);
	errorMsg = signal<string | null>(null);
	products$ = this.productService.products$;
	titulo = 'Simulação';

		irParaCadastroProduto() {
			this.router.navigate(['/novo-produto']);
		}

		constructor(
			private productService: ProductService,
			private simulationService: SimulationService,
			private router: Router,
			private route: ActivatedRoute
		) {
			this.productService.fetchProducts().subscribe({
				next: (products: Product[]) => this.productService.setProducts(products),
				error: () => this.errorMsg.set('Erro ao buscar produtos.')
			});

			this.route.queryParams.subscribe(params => {
				const id = params['produtoId'];
				if (id) {
					this.produtoId.set(Number(id));
				}
			});
		}

	simulate(): void {
		this.errorMsg.set(null);
		this.loading.set(true);
		const produto = this.products$().find((p: Product) => p.id === this.produtoId());
		if (!produto) {
			this.errorMsg.set('Selecione um produto válido.');
			this.loading.set(false);
			return;
		}
		const request: SimulationRequest = {
			produtoId: produto.id!,
			valor: this.valor(),
			meses: this.meses(),
		};
		this.simulationService.simulate(request, produto).subscribe({
			next: (res: any) => {
				if (!res) {
					this.errorMsg.set('Erro ao simular. Tente novamente.');
					this.loading.set(false);
					return;
				}
				this.simulationService.setResult(res);
				this.loading.set(false);
				this.router.navigate(['/resultado']);
			},
			error: () => {
				this.errorMsg.set('Erro ao simular. Tente novamente.');
				this.loading.set(false);
			},
		});
	}
}
