import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule)},
  {path: 'rush', loadChildren: () => import('./rush/rush.module').then(m => m.RushModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    paramsInheritanceStrategy: 'always',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
