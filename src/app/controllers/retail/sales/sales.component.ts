import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CatalogService } from '../../../services/catalog.service';
import { PersonService } from '../../../services/person.service';
import { SelectItem } from 'primeng/api/selectitem';
import { ItemService } from '../../../services/item.service';

@Component({
  selector: 'app-sales',
  templateUrl: '../../../views/retail/sales/sales.component.html',
  styleUrls: ['../../../views/retail/sales/sales.component.css']
})
export class SalesComponent implements OnInit {

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
  // totales
  public precios: number;
  public descuentos: number;
  public sumas: number;
  public iva: number;
  public total: number;
  public personInfo: any;
  // Articulos
  public articulosList: SelectItem[] = [];
  public simbolo: string = '₡';
  public displayDiscount: boolean = false;

  public tipoDescuento: SelectItem[] = [];

  public tipoDescuentoSelected: any;
  public montoDescuento: any;

  constructor(private catalogServices: CatalogService,
    private personServices: PersonService,
    private itemService: ItemService) {
    this.precios = 0;
    this.descuentos = 0;
    this.sumas = 0;
    this.iva = 0;
    this.total = 0;
    this.bodegaSelected = '0';
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

    this.tipoDescuento = [
      { label: 'Porcentaje', value: 1 },
      { label: 'Monto', value: 2 }
    ];

    await this.ngLoadSalesType();
    await this.ngLoadWhereHouse();
  }

  ngLoadSalesType = async () => {
    const body = {
      'P_CATALOGO': 'TIPO_DOCUMENTO_VENTA'
    };
    this.catalogServices.saleType(body).subscribe((data) => {
      if (data) {
        this.tipoVentaList = data;
        this.tipoVentaSelected = '1';
        this.ngChangeSaleType(this.tipoVentaSelected);
      }
    });
  }

  ngLoadWhereHouse = async () => {
    const body = {
      'P_CATALOGO': 'BODEGAS',
      'P_LLAVE_FILTRO': 'COD_CAJERO'
    };
    this.catalogServices.saleType(body).subscribe((data) => {
      if (data) {
        this.bodegaList = data;
        this.bodegaSelected = '1';
      }
    });
  }

  loadItemsSelect = () => {
    const body = {
      'P_CATALOGO': 'ARTICULOS',
      'P_LLAVE_FILTRO': this.bodegaSelected
    };
    this.catalogServices.saleType(body).subscribe((data) => {
      if (data) {
        // this.articulosList = data;
        data.forEach(element => {
          this.articulosList.push({ label: element.description, value: element.id });
        });
        console.log('articulosList', this.articulosList);
      }
    });
  }

  ngArticulosChange = (value) => {
    this.itemService.find(value).subscribe(
      (res) => {
        console.log(res);
        this.car.codigo = res.codigo;
        this.car.descripcion = res.descripcion;
        this.car.cantidad = 1;
        document.getElementById('cantidad').focus();
        this.car.precio = res.precio_venta;
        this.car.descuento = 0.0;
        this.car.sumas = ((this.car.precio * this.car.cantidad) - this.car.descuento);
        this.car.ivaneto = res.iva;
        this.car.iva = this.car.sumas * res.iva;
      });
  }

  ngChangeSaleType = (value) => {
    console.log('entre', value);
    const body = {
      'P_CATALOGO': 'CLIENTES',
      'P_LLAVE_FILTRO': value
    };
    this.catalogServices.saleType(body).subscribe((data) => {
      if (data) {
        this.clienteList = data;
        // this.bodegaSelected = 1;
        console.log('clienteList', this.clienteList);
      }
    });
  }

  ngChangeBodega = (value) => { };

  ngChangeClients = (value) => {
    this.personServices.get(value).subscribe((data) => {
      this.personInfo = data;
      console.log(this.personInfo);
      this.telefonoSelected = this.personInfo.telefono;
      this.correoSelected = this.personInfo.correo;
    });
  }

  showDialogToAdd() {
    this.newCar = true;
    this.car = {};
    this.displayDialog = true;
    this.loadItemsSelect();
  }

  save() {
    const cars = [...this.items];
    // ==> operaciones de la nueva linea
    this.car.sumas = ((this.car.precio * this.car.cantidad) - this.car.descuento);
    this.car.iva = this.car.sumas * this.car.ivaneto;
    this.car.total = (this.car.sumas +  this.car.iva);
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
  }

  aplicarDescuento() {
    if (this.tipoDescuentoSelected === 1) {
      const tmpDiscount = (this.car.precio * this.montoDescuento);
      this.car.descuento = tmpDiscount;
    }
  }
}
