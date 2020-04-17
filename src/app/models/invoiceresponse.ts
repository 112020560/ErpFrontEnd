export class Invoice {
    invoice: number;
    idperson: number;
    ammount: number;
    descount: number;
    sums: number;
    tax: number;
    total: number;
    detail: InvoiceDetail[];
    mthpayment: MethodOfPayet[];
}

export class InvoiceDetail {
    codigo: string;
    descripcion: string;
    cantidad: number;
    precio: number;
    total: number;
}

export class MethodOfPayet {
    method: string;
    ammout: number;
    cardNumber: string;
}
