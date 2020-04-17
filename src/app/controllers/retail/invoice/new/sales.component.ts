import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CatalogService } from '../../../../services/catalog.service';
import { PersonService } from '../../../../services/person.service';
import { SelectItem } from 'primeng/api/selectitem';
import { ItemService } from '../../../../services/item.service';
import { DocumentService } from '../../../../services/document.service';
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Router, ActivatedRoute, Params } from '@angular/router';
import Swal from 'sweetalert2';

interface ResponseObject<T> {
  rc: number;
  message: string;
  data: T;
}

@Component({
  selector: 'app-sales',
  templateUrl: '../../../../views/retail/invoice/new/sales.component.html',
  styleUrls: ['../../../../views/retail/invoice/new/sales.component.css']
})
export class SalesComponent implements OnInit {

  usuarioSistema: string = 'felipe.alpizar';
  modalRef: BsModalRef;
  public tipoVentaList: any[] = [];
  public tipoVentaSelected: any;
  public bodegaList: any[] = [];
  public bodegaSelected: any;
  dateI = new FormControl(new Date());
  public clienteList: any[] = [];
  public clienteSelected: any;
  public correoSelected: any;
  public telefonoSelected: any;
  public displayDialog: boolean;
  public car: any = {};
  public selectedCar: any;
  public newCar: boolean;
  public items: any[];
  public cols: any[];
  public advcols: any[];
  // totales
  public precios: number;
  public descuentos: number;
  public sumas: number;
  public iva: number;
  public total: number;
  public personInfo: any;
  // Articulos
  public articulosList: SelectItem[] = [];
  public listproduct: any[] = [];
  public simbolo: string = '₡';
  public displayDiscount: boolean = false;

  public tipoDescuento: SelectItem[] = [];

  public tipoDescuentoSelected: any;
  public montoDescuento: any;
  // Articulos
  public codigo: any;
  public descripcion: any;
  public descripcionProveedor: any;
  public lineaSelected: any;
  public lineas: any[] = [];
  public modeloSelected: any;
  public modelos: any[] = [];
  public marcaSelected: any;
  public marcas: any[] = [];
  public advanced: any[] = [];
  public advancedSelected: any = {};
  // Formas de pago
  public methodOfPaymentList: any[] = [];
  public methodOfPaymenSelected: any = 0;
  public amountPay: any;
  public showcardInfo: boolean = false;
  public cardMarkList: any[] = [];
  public cardMarcSelect: any = 0;
  public cardBankList: any[] = [];
  public cardBankselect: any = 0;
  public authNumeber: any = '';

  public responseDoc: any;
  public displayTicket: boolean = false;
  // Ticket
  public direccion: string = '';
  public detalledireccion: string = '';
  public cliente: string = '';
  public enviado: string = 'En tienda.';
  public fechaTicket: Date;
  public responseData: any;
  public detalleArticulos: any[] = [];
  public numFactura: any = '';
  myControl = new FormControl();
  filteredOptions: Observable<any[]>;
  responseSaveInvoice: any; // ResponseObject<any[]>;
  private documentId: any;
  private document: any;

  constructor(private catalogServices: CatalogService, private modalService: BsModalService,
    private personServices: PersonService,
    private itemService: ItemService,
    private documentservice: DocumentService,
    private messageService: MessageService,
    // private datePipe: DatePipe
    private activatedRoute: ActivatedRoute
  ) {
    this.precios = 0;
    this.descuentos = 0;
    this.sumas = 0;
    this.iva = 0;
    this.total = 0;
    this.bodegaSelected = '0';
    this.lineaSelected = 0;
    this.modeloSelected = 0,
      this.marcaSelected = 0;
    this.codigo = '';
    this.descripcion = '';
  }

  async ngOnInit() {

    this.items = [];
    this.cols = [
      { field: 'codigo', header: 'Codigo' },
      { field: 'descripcion', header: 'Descripcion' },
      { field: 'cantidad', header: 'Cantidad' },
      { field: 'precio', header: 'Precio' },
      { field: 'descuento', header: 'Descuento' },
      { field: 'sumas', header: 'Sumas' },
      { field: 'iva', header: 'IVA' },
      { field: 'total', header: 'Total' }
    ];

    this.advcols = [
      { field: 'codigo_producto', header: 'Codigo' },
      { field: 'descripcion1', header: 'Descripcion' },
      { field: 'linea', header: 'Linea' },
      { field: 'modelo', header: 'Modelo' },
      { field: 'marca', header: 'Marca' },
      { field: 'cantidad', header: 'Cantidad' },
      { field: 'cantidad_bloqueda', header: 'Bloquedo' }
    ];

    this.tipoDescuento = [
      { label: 'Porcentaje', value: 1 },
      { label: 'Monto', value: 2 }
    ];

    await this.ngLoadSalesType();
    await this.ngLoadWhereHouse();

    this.activatedRoute.params.subscribe(params => {
      // const userId = params['userId'];
      // console.log(userId);
      console.log('parametros => ', params);
      if (params.id) {
        this.documentId = params.id;
        // this.loadInvoice();
      }
    });
  }

  // Inicio Metodos Devoluciones
  loadInvoice = async () => {
    console.log('loadInvoice');

    this.documentservice.findById(this.documentId).subscribe((data) => {
      console.log(' documeno ', data);
      if (data) {
        this.document = data;
        this.tipoVentaSelected = String(this.document.fkTipoDocumento);
        this.dateI = new FormControl(new Date(this.document.fechaInserta));
        this.clienteSelected = String(this.document.fkPersona);
        // Selecciona la persona
        this.selectPerson(this.clienteSelected);
        this.loadInvoiceDetail();
        this.descuentos = Number(this.document.descuento);
        this.sumas = Number(this.document.suma);
        this.iva = Number(this.document.imp00);
        this.total = Number(this.document.total);
      }
    });
  }

  loadInvoiceDetail = async () => {
    if (this.document.documentoDetalles) {
      this.document.documentoDetalles.forEach(element => {
        const subtotal = Number(element.precio - element.descuento);
        this.items.push(
          {
            codigo: element.fkProducto2.codigo,
            descripcion: element.fkProducto2.descripcion,
            cantidad: element.cantidad,
            precio: element.precioUnitario,
            marca: 'mmmmmmmmmmmm',
            descuento: element.descuento,
            sumas: subtotal,
            iva: element.iva,
            total: subtotal + Number(element.iva)
          }
        );
      });
    }
  }
  // Fin Metodos Devoluciones

  // Cargar los tipos de Venta
  ngLoadSalesType = async () => {
    console.log('ngLoadSalesType');

    this.catalogServices.tipoDocumento().subscribe((data) => {
      if (data) {
        this.tipoVentaList = data;
        this.tipoVentaSelected = '1';
        this.ngChangeSaleType(this.tipoVentaSelected);
      }
    });
  }

  ngLoadWhereHouse = async () => {
    console.log('ngLoadWhereHouse');

    this.catalogServices.bodegas().subscribe((data) => {
      console.log('Data => ', data);
      this.bodegaList = data;
      this.bodegaSelected = '1';
    });
  }

  loadItemsSelect = () => {
    // const body = {
    //   'P_CATALOGO': 'ARTICULOS',
    //   'P_LLAVE_FILTRO': this.bodegaSelected
    // };
    // this.catalogServices.saleType(body).subscribe((data) => {
    //   if (data) {
    //     // this.articulosList = data;
    //     data.forEach(element => {
    //       this.articulosList.push({ label: element.description, value: element.id });
    //     });
    //     document.getElementById('cboitems').focus();
    //     console.log('articulosList', this.articulosList);
    //   }
    // });
    this.itemService.getForSale().subscribe((data) => {
      if (data) {
        this.articulosList = [];
        this.listproduct = data;
        this.listproduct.forEach(element => {
          this.articulosList.push({ label: element.codigo, value: element.pkProducto });
        });
      }
    });
  }

  ngArticulosChange = (value) => {
    // tslint:disable-next-line:triple-equals
    const product = this.listproduct.filter(x => x.pkProducto == value)[0];
    console.log('producto filtrado => ', product);
    if (product) {
      this.car.codigo = product.codigo;
      this.car.descripcion = product.descripcion;
      if (product.productoCantidads.length > 0) {
        const cantSelected = product.productoCantidads.filter(cant => cant.fkBodega == this.bodegaSelected)[0];
        console.log('cantSelected => ', cantSelected);
        this.car.cantidad = 1;
      }

      if (product.listaPreciosProductos.length > 0) {
        // esto hay que filtrarlo mejor
        const listaPreciosSelected = product.listaPreciosProductos[0];
        console.log('listaPreciosSelected => ', listaPreciosSelected);
        this.car.precio = listaPreciosSelected.precioVenta;
        this.car.descuento = 0.0;
        this.car.sumas = ((this.car.precio * this.car.cantidad) - this.car.descuento);
        this.car.ivaneto = listaPreciosSelected.imp01;
        this.car.iva = this.car.sumas * listaPreciosSelected.imp01;
      }
    }
    // this.itemService.find(value).subscribe(
    //   (res) => {
    //     console.log(res);
    //     this.car.codigo = res.codigo;
    //     this.car.descripcion = res.descripcion;
    //     this.car.cantidad = 1;
    //     document.getElementById('cantidad').focus();
    //     this.car.precio = res.precio_venta;
    //     this.car.descuento = 0.0;
    //     this.car.sumas = ((this.car.precio * this.car.cantidad) - this.car.descuento);
    //     this.car.ivaneto = res.iva;
    //     this.car.iva = this.car.sumas * res.iva;
    //   });
  }

  ngChangeSaleType = (value) => {
    this.loadClient(value);
  }

  loadClient = (value) => {
    console.log('loadClient');

    this.personServices.get().subscribe((data) => {
      if (data) {
        this.clienteList = data;
        if (this.documentId) {
          this.loadInvoice();
        }
      }
    });
  }

  ngChangeBodega = (value) => { };

  ngChangeClients = (value) => {
    // this.personServices.get(value).subscribe((data) => {
    //   this.personInfo = data;
    //   console.log(this.personInfo);
    //   this.direccion = this.personInfo.direccion;
    //   this.detalledireccion = this.personInfo.detalle;
    //   this.cliente = this.personInfo.nombre;
    //   this.telefonoSelected = this.personInfo.telefono;
    //   this.correoSelected = this.personInfo.correo;
    //   this.fechaTicket = new Date(); // this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    // });
    this.selectPerson(value);
  }

  selectPerson(value) {
    const clientSelected = this.clienteList.filter(x => x.pkPersona == value)[0];
    console.log('Cliente seleccionado => ', clientSelected);
    if (clientSelected.personaMedioContactos.length > 0) {
      // tslint:disable-next-line:triple-equals
      this.telefonoSelected = clientSelected.personaMedioContactos.filter(x => x.fkMedioContacto == 1 && x.orden == 0)[0].valor;
      console.log('Telefono => ', this.telefonoSelected);
      // tslint:disable-next-line:triple-equals
      this.correoSelected = clientSelected.personaMedioContactos.filter(x => x.fkMedioContacto == 2 && x.orden == 0)[0].valor;
      console.log('Telefono => ', this.telefonoSelected);
    } else {
      this.telefonoSelected = '';
      this.correoSelected = '';
    }
  }

  showDialogToAdd() {
    this.newCar = true;
    this.car = {};
    this.displayDialog = true;
    this.loadItemsSelect();
  }

  showAdvancedSearch(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-xl' });
    this.newCar = true;
    this.car = {};
    this.linea();
    this.modelo();
    this.marca();
  }

  methodOfPayment = () => {
    // const body = {
    //   'P_CATALOGO': 'FORMA_PAGO',
    //   'P_LLAVE_FILTRO': ''
    // };
    // this.catalogServices.saleType(body).subscribe((data) => {
    //   if (data) {
    //     this.methodOfPaymentList = data;
    //     console.log(this.methodOfPaymentList);
    //     this.methodOfPaymenSelected = '1';
    //   }
    // });
    this.catalogServices.metodoPago().subscribe((data) => {
      if (data) {
        this.methodOfPaymentList = data;
        console.log(this.methodOfPaymentList);
        this.methodOfPaymenSelected = '1';
      }
    });
  }

  cardMark = () => {
    const body = {
      'P_CATALOGO': 'MARCA_TARJETA',
      'P_LLAVE_FILTRO': ''
    };
    this.catalogServices.saleType(body).subscribe((data) => {
      if (data) {
        this.cardMarkList = data;
      }
    });
  }

  cardBank = () => {
    const body = {
      'P_CATALOGO': 'BANCOS',
      'P_LLAVE_FILTRO': ''
    };
    this.catalogServices.saleType(body).subscribe((data) => {
      if (data) {
        this.cardBankList = data;
      }
    });
  }

  methodOfPaymentChange = (value) => {
    console.log(value);
    if (value === '2') {
      this.cardBank();
      this.cardMark();
      this.showcardInfo = true;
    } else {
      this.showcardInfo = false;
    }
  }

  // Informacion de los productos
  linea = () => {
    const body = {
      'P_CATALOGO': 'LINEA',
      'P_LLAVE_FILTRO': this.bodegaSelected
    };
    this.catalogServices.saleType(body).subscribe((data) => {
      if (data) {
        this.lineas = data;
      }
    });
  }
  modelo = () => {
    const body = {
      'P_CATALOGO': 'MODELO',
      'P_LLAVE_FILTRO': this.bodegaSelected
    };
    this.catalogServices.saleType(body).subscribe((data) => {
      if (data) {
        this.modelos = data;
      }
    });
  }
  marca = () => {
    const body = {
      'P_CATALOGO': 'MARCA',
      'P_LLAVE_FILTRO': this.bodegaSelected
    };
    this.catalogServices.saleType(body).subscribe((data) => {
      if (data) {
        this.marcas = data;
      }
    });
  }
  advanzedfind = () => {
    const body = {
      'P_BODEGA': parseInt(this.bodegaSelected, 0),
      'P_LINEA': parseInt(this.lineaSelected, 0),
      'P_MODELO': parseInt(this.modeloSelected, 0),
      'P_MARCA': parseInt(this.marcaSelected, 0),
      'P_CODIGO': this.codigo,
      'P_DESCRIPCION': this.descripcion
    };
    this.itemService.advanzedfind(body).subscribe((data) => {
      this.advanced = data;
      this.lineaSelected = 0;
      this.modeloSelected = 0,
        this.marcaSelected = 0;
      this.codigo = '';
      this.descripcion = '';
    });
  }
  onRowSelectadv(event) {
    console.log(this.advancedSelected);
    this.ngArticulosChange(this.advancedSelected.pk_inv_mtr_producto);
    this.modalRef.hide();
  }
  // ==============================

  showMethodOfPayment = (template) => {
    this.methodOfPayment();
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' }); // , {class: 'modal-xl' });
    document.getElementById('monto_pagar').focus();
    this.methodOfPaymenSelected = 1;
    this.amountPay = this.total;
  }

  save() {
    const cars = [...this.items];
    // ==> operaciones de la nueva linea
    this.car.sumas = ((this.car.precio * this.car.cantidad) - this.car.descuento);
    this.car.iva = this.car.sumas * this.car.ivaneto;
    this.car.total = (this.car.sumas + this.car.iva);
    this.car.descuento = this.car.descuento * 1;
    // ==>
    if (this.newCar) {
      cars.push(this.car);
    } else {
      // this.lesTotals();
      cars[this.items.indexOf(this.selectedCar)] = this.car;
      // this.sumTotals();
    }

    this.items = cars;
    this.sumTotals();
    this.car = null;
    this.displayDialog = false;
    document.getElementById('btnadditem').focus();
  }

  sumTotals = () => {
    this.precios = 0;
    this.descuentos = 0;
    this.iva = 0;
    this.total = 0;
    this.sumas = 0;
    console.log('this.items =>', this.items);
    this.items.forEach(element => {
      console.log('elementos del foreach =>', element);
      this.precios = this.precios + element.precio;
      this.descuentos = this.descuentos + element.descuento;
      this.sumas = (this.sumas + element.sumas);
      this.iva = this.iva + element.iva;
    });
    this.total = this.total + (this.iva + this.sumas);
    // ==> totales
    // this.precios = this.precios + this.car.precio;
    // this.descuentos = this.descuentos + this.car.descuento;
    // this.iva = this.iva + this.car.iva;
    // this.total = this.total + (this.iva + this.car.total);
  }

  lesTotals = () => {
    // ==> totales
    this.precios = this.precios - this.car.precio;
    this.descuentos = this.descuentos - this.car.descuento;
    this.iva = this.iva - this.car.iva;
    this.total = this.total - (this.iva + this.car.total);
  }

  delete() {
    const index = this.items.indexOf(this.selectedCar);
    this.items = this.items.filter((val, i) => i !== index);
    this.car = null;
    this.displayDialog = false;
    this.sumTotals();
  }

  onRowSelect(event) {
    this.newCar = false;
    this.car = this.cloneCar(event.data);
    this.displayDialog = true;
  }

  cloneCar(c: any): any {
    const car = {};
    // tslint:disable-next-line:forin
    for (const prop in c) {
      car[prop] = c[prop];
    }
    return car;
  }

  onKeyPress(event: any) {
    if (event.key === 'Enter') {
      const value = event.target.value;
      if (value > 0) {
        this.save();
      }
      console.log('entre', event);
    }
  }

  openDiscountDialog = () => {
    this.displayDiscount = true;
    this.tipoDescuentoSelected = 1;
  }

  aplicarDescuento() {
    console.log('this.tipoDescuentoSelected', this.tipoDescuentoSelected);
    if (this.tipoDescuentoSelected === 1) {
      console.log('Entre Descuento');
      if (this.montoDescuento !== 0) {
        const tmpDiscount = (this.car.precio * (this.montoDescuento / 100));
        this.car.descuento = tmpDiscount;
      } else {
        this.car.descuento = 0.0;
      }

      this.displayDiscount = false;
    }
  }

  guardarFactura = () => {
    // const header = {
    //   p_compania: 1,
    //   p_tienda: 1,
    //   p_tipo_venta: this.tipoVentaSelected,
    //   p_cliente: this.clienteSelected,
    //   p_bodega: this.bodegaSelected,
    //   fecha: new Date(),
    //   p_subtotal: (this.sumas + this.descuentos),
    //   p_descuentos: this.descuentos,
    //   p_iv: 0,
    //   p_iva: this.iva,
    //   p_sumas: this.sumas,
    //   P_total: this.total
    // };

    // const detail = [];
    // const cont = 0;
    // let total = 0;
    // this.items.forEach(element => {
    //   total = (element.precio * element.cantidad);
    //   detail.push({ id: cont, cod: element.codigo, pk: element.id, price: element.precio, qty: element.cantidad, total: total });
    // });

    // const body = {
    //   P_JSON_DOCUMENTO: JSON.stringify(header),
    //   P_JSON_DETALLE: JSON.stringify(detail),
    //   P_JSON_METODOS_PAGO: JSON.stringify([{
    //     id: 1,
    //     metodo: this.methodOfPaymenSelected,
    //     monto: this.amountPay,
    //     banco: this.cardBankselect,
    //     tarjeta: this.cardMarcSelect,
    //     referenica: this.authNumeber,
    //   }]),
    //   P_USUARIO: 'felipe.alpizar'
    // };

    // console.log('Body =>', JSON.stringify(body));

    // this.documentservice.save(body).subscribe((data) => {
    //   if (data) {
    //     this.modalRef.hide();
    //     this.responseDoc = data;
    //     this.responseData = JSON.parse(this.responseDoc.dataResult);
    //     this.displayTicket = true;
    //     console.log('detalle => ', this.responseData[0].detail);
    //     this.detalleArticulos = this.responseData[0].detail;
    //     this.numFactura = this.responseData[0].invoice;
    //     console.log(this.responseDoc);
    //     console.log('Object result => ', this.responseData);
    //     this.showSuccess('Factura creada con exito', `Consecutivo de documento: ${this.responseDoc.consecutivo}`);
    //     // this.clear();
    //   }
    // }, (error) => {
    //   console.error(error);
    // });

    const detail = [];
    let cont = 0;
    let total = 0;
    this.items.forEach(element => {
      cont++;
      total = (element.precio * element.cantidad);
      detail.push(
        {
          fkEstadoDetalle: 1,
          fkProducto: element.id,
          linea: cont,
          precioUnitario: element.precio,
          cantidad: element.cantidad,
          precio: total,
          usuarioInserta: this.usuarioSistema,
          fechaInserta: new Date(),
          usuarioActualiza: null,
          fechaActualiza: null,
          iva: element.iva,
          descuento: element.descuento
        });
    });

    const methodPayment = [
      {
        fkMetodoPago: this.methodOfPaymenSelected,
        monto: this.amountPay,
        strValor01: this.cardBankselect,
        strValor02: this.cardBankselect,
        strValor03: this.cardMarcSelect,
        strValor04: this.authNumeber,
        strValor05: ''
      }
    ];

    const body = {
      fkCompania: 1,
      fktienda: 1,
      fkTipoDocumento: 1,
      fkEstadoDocumento: 1,
      fkPersona: parseInt(this.clienteSelected, null),
      caja: '01',
      monto: (this.sumas + this.descuentos),
      descuento: this.descuentos,
      imp00: this.iva,
      imp01: 0.0000000000,
      imp02: 0.0000000000,
      imp03: 0.0000000000,
      suma: this.sumas,
      total: this.total,
      facturaElectronica: 0,
      usuarioInserta: this.usuarioSistema,
      fechaInserta: new Date(),
      usuarioActualiza: null,
      fechaActualiza: null,
      documentoDetalles: detail,
      methodOfPayment: methodPayment
    };

    console.log(body);

    this.documentservice.save(body).subscribe((data) => {
      console.log('Save Data => ', data);
      if (data) {
        this.modalRef.hide();
        this.responseSaveInvoice = data;
        console.log('responseSaveInvoice => ', this.responseSaveInvoice);
        // this.responseData = JSON.parse(this.responseDoc.dataResult);
        if (this.responseSaveInvoice.rc == 0) {
          this.displayTicket = true;
          // this.detalleArticulos = this.responseData[0].detail;
          this.numFactura = this.responseSaveInvoice.data;
          // console.log(this.responseDoc);
          // console.log('Object result => ', this.responseData);
          this.showSuccessMessage('Factura creada con exito', `Consecutivo de documento: ${this.responseSaveInvoice.data}`);
        } else {
          this.showError(this.responseSaveInvoice.message, 'Eror al guardar la factura');
        }
        // this.clear();
      }
    }, (error) => {
      console.log('error => ', error);
      this.showError(error.message, 'Eror al guardar la factura');
    });
  }

  showSuccess(summary = 'Success Message', detail = 'Order submitted') {
    this.messageService.add({ severity: 'success', summary: summary, detail: detail });
  }

  clear = () => {
    console.log('ejecutado');
    this.tipoVentaSelected = 0;
    this.bodegaSelected = 1;
    this.clienteSelected = 0;
    this.telefonoSelected = '';
    this.correoSelected = '';
    this.items = [];
    this.sumas = 0;
    this.precios = 0;
    this.descuentos = 0;
    this.sumas = 0;
    this.iva = 0;
    this.total = 0;
  }

  showTicket = () => { this.displayTicket = true; };

  imprimir = () => {
    const divToPrint = document.getElementById('html');

    const newWin = window.open('', 'Print-Window');

    newWin.document.open();

    newWin.document.write(
      `<html>
      <style>
      .invoice-title h2,
      .invoice-title h3 {
        display: inline-block;
      }
      .table > tbody > tr > .no-line {
        border-top: none;
      }
      .table > thead > tr > .no-line {
        border-bottom: none;
      }
      .table > tbody > tr > .thick-line {
        border-top: 2px solid;
      }
      </style>
        <body onload="window.print()">` +
      divToPrint.innerHTML +
      '</body></html>'
    );

    newWin.document.close();

    setTimeout(function () {
      newWin.close();
    }, 10);
  }

  displayFn(user?: any): string | undefined {
    return user ? user.description : undefined;
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.clienteList.filter(option => option.description.toLowerCase().indexOf(filterValue) === 0);
  }

  showSuccessMessage(tittle: string, message: string) {
    Swal.fire({
      icon: 'success',
      title: tittle,
      text: message,
      showConfirmButton: false,
      timer: 3500
    });
  }
  showInfoMessage(tittle: string, message: string) {
    Swal.fire({
      icon: 'warning',
      title: tittle,
      text: message,
      showConfirmButton: false,
      timer: 3500
    });
  }
  showError(errormessage: string, title: string = 'Error en el proceso') {
    Swal.fire(
      {
        title: title,
        text: errormessage,
        icon: 'error'
      }
    );
  }
}
