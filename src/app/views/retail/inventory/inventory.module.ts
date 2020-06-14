import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { AddComponent } from './product/add/add.component';
import { InventoryRoutingModule } from './inventory-routing.module';
import { CustomMaterialModule } from '../../../middleware/material.module';
import { CustomPrimeNGModule } from '../../../middleware/primeng.module';

@NgModule({
    imports: [
      FormsModule,
      ReactiveFormsModule,
      InventoryRoutingModule,
      ChartsModule,
      BsDropdownModule,
      ButtonsModule.forRoot(),
      CustomMaterialModule,
      CustomPrimeNGModule
    ],
    declarations: [ AddComponent]
  })
  export class InventoryModule { }
