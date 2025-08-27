import { Component, Input, signal, ChangeDetectionStrategy } from '@angular/core';
import { ProductService, Product } from '../../services/product.service';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-formulario-produto',
    templateUrl: './formulario-produto.component.html',
    
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
	CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSelectModule
	,MatIconModule
]
})

export class FormularioProdutoComponent {
	nome = signal<string>('');
	taxaEfetivaAnual = signal<number>(0); // agora anual
	prazoMaximo = signal<number>(0);
	sistema = signal<string>('PRICE');
	loading = signal<boolean>(false);
	errorMsg = signal<string | null>(null);
	successMsg = signal<string | null>(null);
	titulo = 'Adicionar Produto';

		irParaSimulacao() {
			this.router.navigate(['/simulacao']);
		}

		constructor(private productService: ProductService, private router: Router) {}

			submit(): void {
				this.errorMsg.set(null);
				this.successMsg.set(null);
			if (!this.nome() || this.taxaEfetivaAnual() <= 0 || this.prazoMaximo() <= 0 || !this.sistema()) {
				this.errorMsg.set('Preencha todos os campos corretamente.');
				return;
			}
			this.loading.set(true);
			// Converter taxa anual para mensal equivalente
			const taxaEfetivaMensal = (Math.pow(1 + this.taxaEfetivaAnual() / 100, 1 / 12) - 1) * 100;
			const product: Product = {
				nome: this.nome(),
				taxaEfetivaMensal,
				prazoMaximo: this.prazoMaximo(),
				sistema: this.sistema(),
			};
			this.productService.addProduct(product).subscribe({
				next: () => {
					this.loading.set(false);
					this.successMsg.set('Produto adicionado com sucesso!');
						this.nome.set('');
											   this.taxaEfetivaAnual.set(0);
						this.prazoMaximo.set(0);
						this.sistema.set('PRICE');
						setTimeout(() => {
							this.router.navigate(['/produtos']);
						}, 800);
					},
					error: () => {
						this.loading.set(false);
						this.errorMsg.set('Erro ao adicionar produto. Tente novamente.');
					}
				});
			}
}
