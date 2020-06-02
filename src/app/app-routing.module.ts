import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WrapUpComponent } from './coordinator-wrap-up/wrap-up/wrap-up.component';
import { MainComponent } from './live-results/main/main.component';
import { CoordinatorGuardService } from './services/coordinator-guard.service';
import { LoginComponent } from './login/login.component';
import { EventResultsTableComponent } from './event-results-table/event-results-table.component';

const routes: Routes = [
  { path: 'coordinator-wrap-up', component: WrapUpComponent, canActivate: [CoordinatorGuardService] },
  { path: 'login', component: LoginComponent },
  { path: 'st-live/:id', component: MainComponent },
  { path: 'results', component: EventResultsTableComponent },
  { path: '**', redirectTo: '/st-live/4892', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
