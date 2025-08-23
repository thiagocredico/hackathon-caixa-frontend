import { Component, effect, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
	selector: 'app-lista-produto',
	templateUrl: './lista-produto.component.html',
	styleUrls: ['./lista-produto.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		CommonModule,
		MatCardModule,
		MatListModule,
		MatProgressSpinnerModule,
	],
})
export class ListaProdutoComponent {
	products$ = this.productService.products$;
	titulo = 'Produtos';
	loading = false;
	errorMsg: string | null = null;

	constructor(private productService: ProductService, private router: Router) {
		this.loading = true;
		this.productService.fetchProducts().subscribe({
			next: (products) => {
				this.productService.setProducts(products);
				this.loading = false;
			},
			error: () => {
				this.errorMsg = 'Erro ao carregar produtos.';
				this.loading = false;
			}
		});
	}

	simularComProduto(produtoId: number) {
		this.router.navigate(['/simulacao'], { queryParams: { produtoId } });
	}
	calcularTaxaEfetivaAnual(mensal: number): number {
		// mensal em porcentagem, ex: 2.5
		const mensalDecimal = mensal / 100;
		return (Math.pow(1 + mensalDecimal, 12) - 1) * 100;
	}
}
