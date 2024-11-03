import { NgModule } from '@angular/core';

import { NgxMaskModule } from 'ngx-mask';

import { CoreModule } from "./core/core.module";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ChartModule } from 'primeng/chart';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CoreModule,
    NgxMaskModule.forRoot(),
    AppRoutingModule,
    ChartModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
