import { Component} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { CustomerService } from 'src/app/services/customer.service';
import { ProductService } from 'src/app/services/product.service';
import { ShipmentsService } from 'src/app/services/shipments.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ViewQuoteComponent } from './view.component';
import { GlobalConstants } from "../../../../../common/global-constants";
import { MessengerService } from 'src/app/services/messenger.service';

@Component({
  selector: 'app-shipments-create',
  templateUrl: './create.component.html',
  styleUrls: []
})

export class QuoteCreateComponent {
  urlEndPoint: String = GlobalConstants.apiURL;
  firstFormGroup: FormGroup;
  errorMessages:      string  = '';
  submittedForm:      boolean = false;
  dataDeleted: boolean = false;
  loading: boolean = false;

  branch_office_origin: string = '';
  branch_office_destin: string = '';
  origin_settlement:    string = '';
  destin_settlement:    string = '';
  listCustomers:          any[] = [];
  listProducts:           any[] = [];
  address_origin:         any[] = [];
  address_destin:         any[] = [];
  listSettlement_Origin:  any[] = [];
  listSettlement_Destiny: any[] = [];
  listAddressUser:        any[] = [];
  listQuotesResponseAvailable:     any[] = [];
  listQuotesResponseNotAvailable:  any[] = [];
  listAdditionalCharges:        any[] = [];
  listAdditionalChargesByAuto:  any[] = [];
  listAdditionalChargesByUser:  any[] = [];
  chargesAdditionalChecked:     any[] = [];
  valueSelectPostalCodeOrigin:  string = '';
  valueSelectPostalCodeDestin:  string = '';
  hiddenInputValueDeclared  = true;
  hiddenSteperNext: boolean = true;
  orderByPrice  =   true;
  orderByDate   =   true;

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<QuoteCreateComponent>,
    private formBuilder: FormBuilder,
    private apiShipments: ShipmentsService,
    private apiCustomer: CustomerService,
    private apiProduct: ProductService,
    private apiUtils: UtilsService,
    private utils: Utils,
    private apiMessenger: MessengerService,
    public dialog: MatDialog,
    ){
      this.firstFormGroup = this.formBuilder.group({
        id_customer: new FormControl('', [Validators.required]),
        branch_office_origin: new FormControl('', [Validators.nullValidator]),
        branch_office_destin: new FormControl('', [Validators.nullValidator]),
        origin_postal_code: new FormControl('', [Validators.required]),
        origin_state: new FormControl('', [Validators.required]),
        origin_city: new FormControl('', [Validators.nullValidator]),
        origin_municipality: new FormControl('', [Validators.required]),
        origin_settlement: new FormControl('', [Validators.required]),
        destin_postal_code: new FormControl('', [Validators.required]),
        destin_state: new FormControl('', [Validators.required]),
        destin_city: new FormControl('', [Validators.nullValidator]),
        destin_municipality: new FormControl('', [Validators.required]),
        destin_settlement: new FormControl('', [Validators.required]),
        insurance: new FormControl('', [Validators.nullValidator]),
        ship_date: new FormControl('', [Validators.required]),
        products: this.formBuilder.array([]),
        packages: this.formBuilder.array([]),
        additionals: new FormControl('', []),
      }); 
    }
  secondFormGroup = this.formBuilder.group({});

  ngOnInit(): void {
    this.hiddenInputValueDeclared = true;
    this.apiCustomer.getClients(0, false, false, false, false, false, false, false, false, false, true, false, false, false, true, true, false, false, false, false).subscribe((e: any) => {
      this.listCustomers = e.data;
    });
    this.apiMessenger.getAdditionalCharge(0, false, false, false, false, false).subscribe((e: any) =>{
      this.listAdditionalCharges = e.data;
      this.listAdditionalChargesByAuto = this.listAdditionalCharges.filter(function(i: any){
        return i.made_by === 'AUTOMATICO';
      });
      this.listAdditionalChargesByUser = this.listAdditionalCharges.filter(function(i: any){
        return i.made_by === 'USUARIO';
      });
      if(this.listAdditionalChargesByAuto.length > 0){
        for(var i in this.listAdditionalChargesByAuto){
          this.listAdditionalChargesByAuto[i].isChecked = false;
        }
      }
    });
  }

  packagesParam(): FormArray { //FormArray
    return this.firstFormGroup.get("packages") as FormArray
  }
  newPackagesParam(): FormGroup {
    return this.formBuilder.group({
      type: '',
      long: '',
      width: '',
      high: '',
      weight: '',
      quantity: '',
      campaign: '',
      cost_center: '',
      content: '',
      description: '',
    })
  }
  addPackagesParam() {
    this.packagesParam().push(this.newPackagesParam());
  }
  removePackagesParam(i: number) {
    this.packagesParam().removeAt(i);
  }

  productsParam(): FormArray { //FormArray
    return this.firstFormGroup.get("products") as FormArray
  }
  newProductsParam(): FormGroup {
    return this.formBuilder.group({
      id: '',
      quantity: '',
      campaign: '',
      cost_center: '',
    })
  }

  addProductsParam() {
    this.productsParam().push(this.newProductsParam());
  }
  removeProductsParam(i: number) {
    this.productsParam().removeAt(i);
  }

  setValueNullAddressOrigin(){
    this.firstFormGroup.get('branch_office_origin')?.setValue('');
    this.firstFormGroup.get('origin_postal_code')?.setValue('');
    this.firstFormGroup.get('origin_state')?.setValue('');
    this.firstFormGroup.get('origin_city')?.setValue('');
    this.firstFormGroup.get('origin_municipality')?.setValue('');
    this.firstFormGroup.get('origin_settlement')?.setValue('');
    this.origin_settlement = '';
    this.branch_office_origin = '';
  }

  setValueNullAddressDestin(){
    this.firstFormGroup.get('branch_office_destin')?.setValue('');
    this.firstFormGroup.get('destin_postal_code')?.setValue('');
    this.firstFormGroup.get('destin_state')?.setValue('');
    this.firstFormGroup.get('destin_city')?.setValue('');
    this.firstFormGroup.get('destin_municipality')?.setValue('');
    this.firstFormGroup.get('destin_settlement')?.setValue('');
    this.destin_settlement = '';
    this.branch_office_destin = '';
  }
  // cargar las direcciones del usario selecciuonado
  changeUserSelected(){
    this.setValueNullAddressOrigin();
    this.setValueNullAddressDestin();
    this.apiCustomer.getClients(parseInt(this.firstFormGroup.get('id_customer')?.value!), false, false, false, false, false, false, false, false, false, true, false, false, false, true, true, false, false, false, false).subscribe((e: any) => {
      if(e.result){
        this.listProducts = e.data.products;
        this.listAddressUser = e.data.contactsables;
        if(this.listAddressUser.length == 0){
          this.toastr.warning(e.message, 'No se encontró una dirección', {
            timeOut: 3000,
            enableHtml: true
          });
        }
      }
    });
  }
  // setear los valores del codigo postal seleccionado de origen
  selectPostalCodeOrigin(){
    let id = this.valueSelectPostalCodeOrigin;
    let filterContact = this.listAddressUser.filter(function(item: any) {
      return item.id === id;
    });
    console.log(filterContact)
    for(var item of filterContact){
      this.branch_office_origin = item.contact.branch_office;
      for(var address of item.contact.addressables){
        this.firstFormGroup.get('origin_postal_code')?.setValue(address.address.postal_code);
        this.firstFormGroup.get('origin_state')?.setValue(address.address.state);
        this.firstFormGroup.get('origin_city')?.setValue(address.address.city);
        this.firstFormGroup.get('origin_municipality')?.setValue(address.address.municipality);
        this.firstFormGroup.get('origin_settlement')?.setValue(address.address.settlement);
        this.origin_settlement = address.address.settlement;
      }
    }
  }
  // setear los valores del codigo postal seleccionado de detino
  selectPostalCodeDestin(){
    let id = this.valueSelectPostalCodeDestin;
    let filterContact = this.listAddressUser.filter(function(item: any) {
      return item.id === id;
    });
    for(var item of filterContact){
      this.branch_office_destin = item.contact.branch_office;
      for(var address of item.contact.addressables){
        // this.destin_postal_code = address.address.postal_code;
        this.firstFormGroup.get('destin_postal_code')?.setValue(address.address.postal_code);
        this.firstFormGroup.get('destin_state')?.setValue(address.address.state);
        this.firstFormGroup.get('destin_city')?.setValue(address.address.city);
        this.firstFormGroup.get('destin_municipality')?.setValue(address.address.municipality);
        this.firstFormGroup.get('destin_settlement')?.setValue(address.address.settlement);
        this.destin_settlement = address.address.settlement;
      }
    }
  }
  // agrupar los cargos adicionales eleccionados
  checkAdditionalCharge(item: any){
    item.isChecked = !item.isChecked;
    if(item.isChecked){
      this.chargesAdditionalChecked.push(item.slug);     
    }else{
      var index = this.chargesAdditionalChecked.indexOf(item.slug);
      this.chargesAdditionalChecked.splice(index, 1);
    }

    let insuranceIsTrue = this.chargesAdditionalChecked.find((i => i === 'seguro-de-envio'));
    if(insuranceIsTrue){
        this.hiddenInputValueDeclared = false;
    }else{
      this.hiddenInputValueDeclared = true;
      this.firstFormGroup.get('insurance')?.setValue('');
    }
  }

  // validar el código postal de origen
  validateCPCreate_Origin() {
    this.listSettlement_Origin = [];
    this.apiUtils.getAddressByPostalCode(parseInt(this.firstFormGroup.get('origin_postal_code')?.value!)).subscribe((e: any) => {
      if (e.result) {
        if (e.data.data.length === 0) {
          this.errorMessages = 'Codigo postal no encontrado.';
        }
        else {
          this.address_origin = e.data.data;
          this.firstFormGroup.get('origin_state')?.setValue(this.address_origin[0].state);
          this.firstFormGroup.get('origin_city')?.setValue(this.address_origin[0].city);
          this.firstFormGroup.get('origin_municipality')?.setValue(this.address_origin[0].municipality);
          this.address_origin.forEach((e: any) => {
            if (!this.listSettlement_Origin.find(x => x.settlement == e.settlement)) {
              this.listSettlement_Origin.push({ id: e.id, settlement: e.settlement });
            }
          });
          console.log(this.listSettlement_Origin)
          this.errorMessages = '';
        }
      }
    })
  }
  // validar el código postal de estino
  validateCPCreate_Destiny() {
    this.listSettlement_Destiny = [];
    this.apiUtils.getAddressByPostalCode(parseInt(this.firstFormGroup.get('destin_postal_code')?.value!)).subscribe((e: any) => {
      if (e.result) {
        if (e.data.data.length === 0) {
          this.errorMessages = 'Codigo postal no encontrado.';
        }
        else {
          this.address_destin = e.data.data;
          this.firstFormGroup.get('destin_state')?.setValue(this.address_destin[0].state);
          this.firstFormGroup.get('destin_city')?.setValue(this.address_destin[0].city);
          this.firstFormGroup.get('destin_municipality')?.setValue(this.address_destin[0].municipality);
          this.address_destin.forEach((e: any) => {
            if (!this.listSettlement_Destiny.find(x => x.settlement == e.settlement)) {
              this.listSettlement_Destiny.push({ id: e.c_settlement_type, settlement: e.settlement });
            }
          });
          this.errorMessages = '';
        }
      }
    })
  }
  // obtener la colonia(texto) seleccionada de origen
  selectSettlementOrigin(){
    let colonia = this.firstFormGroup.get('origin_settlement')?.value;
    let selectSettlement = this.listSettlement_Origin.filter(function(i: any){
      return i.id === colonia;
    });
    for(var e of selectSettlement){
      this.origin_settlement = e.settlement;
    }
  }  
  // obtener la colonia(texto) seleccionada de destino
  selectSettlementDestin(){
    let colonia = this.firstFormGroup.get('destin_settlement')?.value;
    let selectSettlement = this.listSettlement_Destiny.filter(function(i: any){
      return i.id === colonia;
    });
    for(var e of selectSettlement){
      this.destin_settlement = e.settlement;
    }
  }

  onSubmit() {
    this.listQuotesResponseAvailable    = [];
    this.listQuotesResponseNotAvailable = [];
    this.errorMessages = '';
    this.submittedForm = true;
    const form = this.firstFormGroup;
    // console.log(form)
    if (form.invalid) {
      this.errorMessages = 'Verifica los datos.';
      return;
    }

    let _products: any[] = [];
    let _packages: any[] = [];

    this.productsParam().value.forEach((i: any) => {
      _products.push(i);
    }); 
    this.packagesParam().value.forEach((i: any) => {
      _packages.push(i);
    });
    
    var _services: any = new Object();
    this.chargesAdditionalChecked.forEach(function(val){
      let name;
      name = val;
      _services[name] = true;
    })
    _services['value_declared'] = form.get('insurance')?.value;

    let _additionals: any[] = [];
    if(form.get('additionals')?.value.length > 0){
      form.get('additionals')?.value.forEach((i: any) => {
        _additionals.push(i);
      });
    }

    const _origin = {
      postal_code:  form.get('origin_postal_code')?.value,
      state:        form.get('origin_state')?.value,
      city:         form.get('origin_city')?.value,
      municipality: form.get('origin_municipality')?.value,
      settlement:   this.origin_settlement,
      branch_office: this.branch_office_origin,
    };
    const _destin = {
      postal_code:  form.get('destin_postal_code')?.value,
      state:        form.get('destin_state')?.value,
      city:         form.get('destin_city')?.value,
      municipality: form.get('destin_municipality')?.value,
      settlement:   this.destin_settlement,
      branch_office: this.branch_office_destin,
    };
    const data = {
      id_customer:  form.get('id_customer')?.value,
      ship_date:    form.get('ship_date')?.value,
      origin: _origin,
      destin: _destin,
      products: _products,
      packages: _packages,
      services: _services,
      additionals: _additionals,
    };
    console.log(data)
    if(!form.invalid){
      this.loading = true;
      this.hiddenSteperNext = true;
    }
    
    this.apiShipments.storeQuote(data).subscribe(
      (e: any) => {
        this.submittedForm = false;
        this.loading = false;
        if (e.result) {
          this.toastr.success(e.message, 'Cotización', {
            timeOut: 3000,
            enableHtml: true
          });
          this.hiddenSteperNext = false;
          // console.log(e.data)
          
          for (let i of e.data) {
            if (i.status == 'DISPONIBLE') {
              this.listQuotesResponseAvailable.push(i);
            }else{
              this.listQuotesResponseNotAvailable.push(i);
            }
          }

          console.log(this.listQuotesResponseAvailable);
        } else {
          this.toastr.error(e.message, 'Cotización', {
            timeOut: 3000,
            enableHtml: true
          });
        }
      },
      (error) => {
        console.log(error)
        this.loading = false;
        let message = this.utils.getErrorMessage(error);
        this.errorMessages = message;
      }
    );
  }
  // ordenar datos por precio
  orderPrice(){
    if(this.orderByPrice){
      let sortData = this.listQuotesResponseAvailable.sort((a, b) => a.numbers.total - b.numbers.total);
      this.listQuotesResponseAvailable = sortData;
    }else{
      let sortData = this.listQuotesResponseAvailable.sort((a, b) => b.numbers.total - a.numbers.total);
      this.listQuotesResponseAvailable = sortData;
    }
    this.orderByPrice = !this.orderByPrice;
  }
  // podenar datos la fecha de entrega estimada
  orderDate(){
    if(this.orderByDate){
      let sortData = this.listQuotesResponseAvailable.sort((a, b) => {
        var partes = a.dates.delivery_date.split('-');
        var fa: any = new Date(partes[2], partes[1], partes[0]);
        partes = b.dates.delivery_date.split('-');
        var fb: any = new Date(partes[2], partes[1], partes[0]);
        return fa - fb;
      });
      this.listQuotesResponseAvailable = sortData;
    }else{
      let sortData = this.listQuotesResponseAvailable.sort((a, b) => {
        var partes = a.dates.delivery_date.split('-'); 
        var fa: any = new Date(partes[2], partes[1], partes[0]);
        partes = b.dates.delivery_date.split('-');
        var fb: any = new Date(partes[2], partes[1], partes[0]);
        return fb - fa;
      });
      this.listQuotesResponseAvailable = sortData;
    }
    this.orderByDate = !this.orderByDate;
  }

  // visualizar las cotizaciones obtenidas
  openModalDetails(id: number) {
    const dialogRef = this.dialog.open(ViewQuoteComponent, {
      width: '80vw',
      data: { _id: id, dataDeleted: this.dataDeleted },
      disableClose: true
    });
  }

  createShipment(item: any){
    console.log(item)
  }
}
