import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EntriesRoutingModule } from './entries-routing.module';

import { EntryListComponent } from './entry-list/entry-list.component';
import { EntryFormComponent } from './entry-form/entry-form.component';

import { CalendarModule } from 'primeng/calendar';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    EntriesRoutingModule,
    ReactiveFormsModule,
    CalendarModule,
    NgxMaskModule.forRoot(),
  ],
})
export class EntriesModule { }
