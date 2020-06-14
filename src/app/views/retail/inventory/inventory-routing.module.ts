import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddComponent } from './product/add/add.component';

const routes: Routes = [
    {
        path: '',
        data: {
          title: 'Inventario'
        },
        children: [
            {
                path: '',
                redirectTo: 'inventario'
            },
            {
                path: 'nuevo',
                component: AddComponent,
                data: {
                  title: 'Nuevo'
                }
              }
        ]
    }
  ];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class InventoryRoutingModule {}
