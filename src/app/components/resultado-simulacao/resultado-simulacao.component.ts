import { Component, computed } from '@angular/core';
import { DecimalPipe, CommonModule } from '@angular/common';
import { SimulationService } from '../../services/simulation.service';
import { ChangeDetectionStrategy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
@Component({
    selector: 'app-resultado-simulacao',
    templateUrl: './resultado-simulacao.component.html',
    styleUrls: ['./resultado-simulacao.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        MatCardModule,
        MatListModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatIconModule,
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

	constructor(private simulationService: SimulationService) {}

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
}
