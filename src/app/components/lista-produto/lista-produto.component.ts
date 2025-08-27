import { Component, effect, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
@Component({
    selector: 'app-lista-produto',
	templateUrl: './lista-produto.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        MatCardModule,
        MatListModule,
	MatProgressSpinnerModule,
	MatIconModule,
	MatButtonModule,
    ]
})
export class ListaProdutoComponent {
	products$ = this.productService.products$;
	titulo = 'Produtos';
	loading = false;
	errorMsg: string | null = null;

		constructor(private productService: ProductService, public router: Router) {
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
		const mensalDecimal = mensal / 100;
		return (Math.pow(1 + mensalDecimal, 12) - 1) * 100;
	}
}
