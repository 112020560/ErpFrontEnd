import { Component, OnInit, TemplateRef } from '@angular/core';
import { DocumentService } from '../../../../services/document.service';
import { PersonService } from '../../../../services/person.service';

import { Router, ActivatedRoute, Params } from '@angular/router';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-list',
  templateUrl: '../../../../views/retail/invoice/list/list.component.html',
  styleUrls: ['../../../../views/retail/invoice/list/list.component.css']
})
export class ListComponent implements OnInit {
  cols: any[];
  realdata: any[];
  invoices: any[];
  invoiceSelected: any;
  private person: any;
  modalRef: BsModalRef;
  detail: any[] = [];
  items: any[];

  constructor(private document: DocumentService,
              private router: Router,
              private personServices: PersonService,
              private modalService: BsModalService) { }

  async ngOnInit() {
    this.cols = [
      { field: 'numerodocumento', header: 'Factura' },
      { field: 'fecha_inserta', header: 'Fecha' },
      { field: 'tienda', header: 'Tienda' },
      { field: 'tipodocumento', header: 'Tipo' },
      { field: 'estado', header: 'Estado' },
      { field: 'cliente', header: 'Cliente' },
      { field: 'monto', header: 'Sumas' },
      { field: 'descuento', header: 'Descuento' },
      { field: 'sumas', header: 'SubTotal' },
      { field: 'IMP00', header: 'Imp.Venta' },
      { field: 'IMP01', header: 'I.V.A' },
      { field: 'total', header: 'Total' }
    ];
    await this.list();
  }

  list = async () => {
    const payload = {
      consulta: '',
      tiendas: '1|',
      estados: '19|21|',
      tipos: '1|2|',
      fechaInicio: '19000101',
      fechaFin: '19000101'
    };

    this.document.list().subscribe((data) => {
      console.log(data);
      if (data) {

        this.realdata = data;
        this.invoices = [];
        this.realdata.forEach(element => {
          this.invoices.push(
            {
              numerodocumento: element.pkDocumento,
              fecha_inserta: element.fechaInserta,
              tienda: element.fkTienda2.descripcion,
              tipodocumento: element.fk_tipo_documento2.descripcion,
              estado: element.fk_estado_documento2.descripcion,
              cliente: element.fkpersona2.nombreCompleto,
              monto: element.monto,
              descuento: element.descuento,
              sumas: element.suma,
              IMP00: element.imp01,
              IMP01: element.imp00,
              total: element.total
            }
          );
        });
      }
    });
  }

  getPerson(id): any {
    this.personServices.find(id).subscribe((data) => {
      if (data) {
        console.log('personas ==> ', data);
        this.person = data;
        return this.person.nombreCompleto;
      }
      return 'No encontrado';

    }, error => {
      return 'Error';
    });
  }

  onRowEditInit = (value) => {
    console.log(value);
    this.router.navigate([`/facturas/editar/${value.numerodocumento}`]);
  }

  openModal(template: TemplateRef<any>, pkdocumento: number) {
    this.modalRef = this.modalService.show(template, { class: 'modal-xl' });

    this.detail = this.realdata.filter(i => i.pkDocumento == pkdocumento)[0].documentoDetalles;
    console.log('detalle => ', this.detail);

    this.items = [];
    this.detail.forEach(element => {
      const subtotal = Number(element.precio - element.descuento);
      this.items.push(
        {
          codigo: element.fkProducto2.codigo,
          descripcion: element.fkProducto2.descripcion,
          precioU: element.precioUnitario,
          cantidad: element.cantidad,
          precio: (element.precioUnitario * element.cantidad),
          descuento: element.descuento,
          sumas: subtotal,
          iva: element.iva,
          total: subtotal + Number(element.iva)
        }
      );
    });

    console.log(this.items);
  }

}
