import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalesComponent } from './sales/sales.component';

const routes: Routes = [
    {
        path: '',
        data: {
          title: 'Retail'
        },
        children: [
            {
                path: '',
                redirectTo: 'retail'
            },
            {
                path: 'sales',
                component: SalesComponent,
                data: {
                  title: 'Sales'
                }
              },
        ]
    }
  ];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class RetailRoutingModule {}
