import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'produtos',
    loadComponent: () => import('./components/lista-produto/lista-produto.component').then(m => m.ListaProdutoComponent),
  },
  {
    path: 'novo-produto',
    loadComponent: () => import('./components/formulario-produto/formulario-produto.component').then(m => m.FormularioProdutoComponent),
  },
  {
    path: 'simulacao',
    loadComponent: () => import('./components/simulacao-emprestimo/simulacao-emprestimo.component').then(m => m.SimulacaoEmprestimoComponent),
  },
  {
    path: 'resultado',
    loadComponent: () => import('./components/resultado-simulacao/resultado-simulacao.component').then(m => m.ResultadoSimulacaoComponent),
  },
  {
    path: '',
    loadComponent: () => import('./components/splash/splash.component').then(m => m.SplashComponent),
  },
  { path: '**', redirectTo: 'simulacao' },
];
