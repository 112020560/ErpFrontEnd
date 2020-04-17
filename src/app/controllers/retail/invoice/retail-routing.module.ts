import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalesComponent } from './new/sales.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
    {
        path: '',
        data: {
          title: 'Facturas'
        },
        children: [
            {
                path: '',
                redirectTo: 'facturas'
            },
            {
                path: 'nueva',
                component: SalesComponent,
                data: {
                  title: 'Nueva'
                }
              },
              {
                path: 'editar/:id',
                component: SalesComponent,
                data: {
                  title: 'Editar'
                }
              },
              {
                path: 'lista',
                component: ListComponent,
                data: {
                  title: 'lista'
                }
              }
        ]
    },
    // {
    //   path: '',
    //   data: {
    //     title: 'Invoice'
    //   },
    //   children: [
    //     {
    //       path: '',
    //       redirectTo: 'invoice'
    //     },
    //     {
    //       path: 'list',
    //       component: ListComponent,
    //       data: {
    //         title: 'list'
    //       }
    //     }
    //   ]
    // }
  ];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class RetailRoutingModule {}
