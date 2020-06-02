import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { WrapUpComponent } from './coordinator-wrap-up/wrap-up/wrap-up.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule, MatIconModule, MatInputModule, MatSelectModule, MatSliderModule, MatToolbarModule,
  MatCardModule, MatSlideToggleModule, MatListModule, MatTableModule, MatProgressSpinnerModule,
  MatExpansionModule, MatSnackBarModule } from '@angular/material';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { WrapUpScoresComponent } from './coordinator-wrap-up/wrap-up-scores/wrap-up-scores.component';
import { WrapUpDoggiesComponent } from './coordinator-wrap-up/wrap-up-doggies/wrap-up-doggies.component';
import { WrapUpVolunteersComponent } from './coordinator-wrap-up/wrap-up-volunteers/wrap-up-volunteers.component';
import { WrapUpCMPCComponent } from './coordinator-wrap-up/wrap-up-cmpc/wrap-up-cmpc.component';
import { LoginComponent } from './login/login.component';
import { WrapQuotablesComponent } from './coordinator-wrap-up/wrap-quotables/wrap-quotables.component';
import { WrapUpStylinComponent } from './coordinator-wrap-up/wrap-up-stylin/wrap-up-stylin.component';
import { WrapUpWinnerPhotoComponent } from './coordinator-wrap-up/wrap-up-winner-photo/wrap-up-winner-photo.component';
import { WrapUpKidsMoneyComponent } from './coordinator-wrap-up/wrap-up-kids-money/wrap-up-kids-money.component';
import { WrapUpSummariesComponent } from './coordinator-wrap-up/wrap-up-summaries/wrap-up-summaries.component';
import { MainComponent } from './live-results/main/main.component';
import { EventResultsTableComponent } from './event-results-table/event-results-table.component';

@NgModule({
  declarations: [
    AppComponent,
    WrapUpComponent,
    WrapUpScoresComponent,
    WrapUpDoggiesComponent,
    WrapUpVolunteersComponent,
    WrapUpCMPCComponent,
    LoginComponent,
    WrapQuotablesComponent,
    WrapUpStylinComponent,
    WrapUpWinnerPhotoComponent,
    WrapUpKidsMoneyComponent,
    WrapUpSummariesComponent,
    MainComponent,
    EventResultsTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatButtonModule, MatIconModule, MatInputModule, MatSelectModule, MatSliderModule, MatToolbarModule,
    MatCardModule, MatSlideToggleModule, MatDialogModule, MatListModule, MatTableModule, MatProgressSpinnerModule,
    MatExpansionModule, MatSnackBarModule, MatButtonToggleModule, MatProgressBarModule, MatTabsModule,
    BrowserAnimationsModule
  ],
  entryComponents: [],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
