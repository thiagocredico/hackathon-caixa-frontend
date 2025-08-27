import { Component, computed } from '@angular/core';
import { DecimalPipe, CommonModule } from '@angular/common';
import { SimulationService } from '../../services/simulation.service';
import { Router } from '@angular/router';
import { ChangeDetectionStrategy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
@Component({
    selector: 'app-resultado-simulacao',
	templateUrl: './resultado-simulacao.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        MatCardModule,
        MatListModule,
        MatButtonModule,
        MatProgressSpinnerModule,
	MatTableModule,
	MatIconModule,
	MatExpansionModule,
	MatDividerModule,
    ]
})
export class ResultadoSimulacaoComponent {
	result$ = this.simulationService.result$;
	get resultado() {
		return this.result$();
	}
	titulo = 'Resultado da Simulação';
	loading = false;
	errorMsg: string | null = null;
	successMsg: string | null = null;

	constructor(private simulationService: SimulationService, private router: Router) {}

	monthLabel(mes: number): string {
		const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
		const now = new Date();
		const dt = new Date(now.getFullYear(), now.getMonth() + (mes - 1));
		return `${months[dt.getMonth()]}/${dt.getFullYear()}`;
	}

	parcelaFor(m: any): number {
		if (!m) return this.resultado?.parcelaMensal ?? 0;
		return (m.parcela !== undefined && m.parcela !== null) ? m.parcela : (this.resultado?.parcelaMensal ?? 0);
	}

	salvarResultado(): void {
		this.errorMsg = null;
		this.successMsg = null;
		this.loading = true;
		setTimeout(() => {
			this.loading = false;
			this.successMsg = 'Resultado salvo com sucesso!';
		}, 1200);
	}

	exportToPDF(): void {
		this.errorMsg = null;
		this.successMsg = null;
		this.loading = true;
		setTimeout(() => {
			this.loading = false;
			this.successMsg = 'PDF exportado com sucesso!';
		}, 1200);
	}

	voltar(): void {
		window.history.back();
	}

	irParaSimulacao(): void {
		this.router.navigate(['/simulacao']);
	}
}
