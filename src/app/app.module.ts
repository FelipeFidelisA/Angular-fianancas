import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { CoreModule } from './core/core.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

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
    RouterModule.forRoot([]),
    AppRoutingModule,
    CoreModule,
    ReactiveFormsModule,
    CalendarModule,
    NgxMaskModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
