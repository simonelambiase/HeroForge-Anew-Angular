import { Routes } from '@angular/router';

import { BuilderShellComponent } from './features/builder/builder-shell/builder-shell.component';

export const routes: Routes = [
  { path: 'builder', component: BuilderShellComponent },
  { path: '', pathMatch: 'full', redirectTo: 'builder' },
  { path: '**', redirectTo: 'builder' },
];
