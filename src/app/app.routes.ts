import { Routes } from '@angular/router';
import { FormularioProdutoComponent } from './components/formulario-produto/formulario-produto.component';
import { ListaProdutoComponent } from './components/lista-produto/lista-produto.component';

import { SimulacaoEmprestimoComponent } from './components/simulacao-emprestimo/simulacao-emprestimo.component';
import { ResultadoSimulacaoComponent } from './components/resultado-simulacao/resultado-simulacao.component';
import { SplashComponent } from './components/splash/splash.component';

export const routes: Routes = [
  { path: 'produtos', component: ListaProdutoComponent },
  { path: 'novo-produto', component: FormularioProdutoComponent },
  { path: 'simulacao', component: SimulacaoEmprestimoComponent },
  { path: 'resultado', component: ResultadoSimulacaoComponent },
  { path: '', component: SplashComponent },
  { path: '**', redirectTo: 'simulacao' },
];
