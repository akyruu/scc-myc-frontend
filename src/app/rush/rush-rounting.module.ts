import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';

import {RushComponent} from './components';
import {RushGuard} from './guards';

const routes: Route[] = [
  {path: '', component: RushComponent, canActivate: [RushGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [RushGuard]
})
export class RushRountingModule {}
