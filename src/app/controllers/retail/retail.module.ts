import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { SalesComponent } from './sales/sales.component';
import { RetailRoutingModule } from './retail-routing.module';
import { CustomMaterialModule } from '../../middleware/material.module';
import { CustomPrimeNGModule } from '../../middleware/primeng.module';

@NgModule({
    imports: [
      FormsModule,
      ReactiveFormsModule,
      RetailRoutingModule,
      ChartsModule,
      BsDropdownModule,
      ButtonsModule.forRoot(),
      CustomMaterialModule,
      CustomPrimeNGModule
    ],
    declarations: [ SalesComponent ]
  })
  export class RetailModule { }
