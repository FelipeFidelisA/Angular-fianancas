import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDatabase } from './pages/categories/in-memory-database';
import { EntryListComponent } from './pages/entries/entry-list/entry-list.component';
import { Router, RouterModule } from '@angular/router';
import { EntryFormComponent } from './pages/entries/entry-form/entry-form.component';

import { CalendarModule } from 'primeng/calendar';
import { NgxMaskModule } from 'ngx-mask';
@NgModule({
  declarations: [
    AppComponent,
    EntryListComponent,
    EntryFormComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([]),
    AppRoutingModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDatabase),
    ReactiveFormsModule,
    CalendarModule,
    NgxMaskModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
