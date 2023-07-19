import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { CustomerService } from 'src/app/services/customer.service';
import { MeProfileService } from 'src/app/services/meProfile.service';
import { UtilsService } from 'src/app/services/utils.service';
import { GlobalConstants } from "../../../../../common/global-constants";
import { MessengerService } from 'src/app/services/messenger.service';
import { MeQuoteDetailsComponent } from '../details/details.component';

@Component({
  selector: 'app-shipments-create',
  templateUrl: './create.component.html',
  styleUrls: []
})

// Exportamos nuestro componente
export class MeQuoteCreateComponent implements OnInit {

  // Definimos las variables a utilizar en este compoenente
  public urlEndPoint      : String = GlobalConstants.apiURL;
  public firstFormGroup   : FormGroup;
  public thirdFormGroup   : FormGroup;
  public dataToShip       : any;
  public quoteToShip      : any;
  public errorMessages    : string  = '';
  public submittedForm    : boolean = false;
  public dataDeleted      : boolean = false;
  public loading          : boolean = false;
  public loading_quote    : boolean = false;
  public loading_ship     : boolean = false;
  public disabledBtnPdf   : boolean = false;
  // otras variables
  branch_office_origin: string = '';
  branch_office_destin: string = '';
  origin_settlement:    string = '';
  destin_settlement:    string = '';
  listCustomers:          any[] = [];
  listServicesClient:     any[] = [];
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

  // Definimos los servicios de los que haremos uso en este compoenente
  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<MeQuoteCreateComponent>,
    private formBuilder: FormBuilder,
    private apiCustomer: CustomerService,
    private apiUtils: UtilsService,
    private utils: Utils,
    private apiMessenger: MessengerService,
    private api_MeQuote: MeProfileService,
    public dialog: MatDialog,
    private http: HttpClient,
  ) {
    this.firstFormGroup = this.formBuilder.group({
      id_customer: new FormControl('', [Validators.required]),
      id_products: new FormControl('', [Validators.required]),
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
      // ship_date: new FormControl('', [Validators.required]),
      products: this.formBuilder.array([]),
      packages: this.formBuilder.array([]),
      additionals: new FormControl('', []),
    }); 

    this.thirdFormGroup = this.formBuilder.group({
      id_quote:  new FormControl('', [Validators.required]),
      id_customer:  new FormControl('', [Validators.required]),
      origin_postal_code:  new FormControl('', [Validators.required]),
      origin_state:  new FormControl('', [Validators.required]),
      origin_city:  new FormControl('', [Validators.nullValidator]),
      origin_municipality:  new FormControl('', [Validators.required]),
      origin_settlement:  new FormControl('', [Validators.required]),
      origin_street:  new FormControl('', [Validators.required]),
      origin_suburb:  new FormControl('', [Validators.required]),
      origin_location:  new FormControl('', [Validators.nullValidator]),
      origin_reference:  new FormControl('', [Validators.required]),
      origin_outdoor_number:  new FormControl('', [Validators.required]),
      origin_interior_number:  new FormControl('', [Validators.nullValidator]),
      origin_branch_office:  new FormControl('', [Validators.required]),
      origin_business:  new FormControl('', [Validators.required]),
      origin_contact:  new FormControl('', [Validators.required]),
      origin_stall:  new FormControl('', [Validators.required]),
      origin_rfc:  new FormControl('', [Validators.nullValidator]),
      origin_phone:  new FormControl('', [Validators.required]),
      origin_email:  new FormControl('', [Validators.required]),

      destin_postal_code:  new FormControl('', [Validators.required]),
      destin_state:  new FormControl('', [Validators.required]),
      destin_city:  new FormControl('', [Validators.nullValidator]),
      destin_municipality:  new FormControl('', [Validators.required]),
      destin_settlement:  new FormControl('', [Validators.required]),
      destin_street:  new FormControl('', [Validators.required]),
      destin_suburb:  new FormControl('', [Validators.required]),
      destin_location:  new FormControl('', [Validators.nullValidator]),
      destin_reference:  new FormControl('', [Validators.required]),
      destin_outdoor_number:  new FormControl('', [Validators.required]),
      destin_interior_number:  new FormControl('', [Validators.nullValidator]),
      destin_branch_office:  new FormControl('', [Validators.required]),
      destin_business:  new FormControl('', [Validators.required]),
      destin_contact:  new FormControl('', [Validators.required]),
      destin_stall:  new FormControl('', [Validators.required]),
      destin_rfc:  new FormControl('', [Validators.nullValidator]),
      destin_phone:  new FormControl('', [Validators.required]),
      destin_email:  new FormControl('', [Validators.required]),

    });
  }
  secondFormGroup = this.formBuilder.group({});
  
  // Cargamos todos los servicios que se cargen al principio
  ngOnInit(): void {
    this.hiddenInputValueDeclared = true;
    // Obtenemos a los clientes y los asignamos a la variable correspondiente
    this.api_MeQuote.getMeCustomersBasic().subscribe((e: any) => {
      this.listCustomers = e.data;
    });
    // Obtenemos los cargos adicionales
    this.apiMessenger.getAdditionalCharge(0, false, false, false, false, false).subscribe((e: any) =>{
      this.listAdditionalCharges = e.data;
      // Filtramos los que son automaticos
      this.listAdditionalChargesByAuto = this.listAdditionalCharges.filter(function(i: any){
        return i.made_by === 'AUTOMATICO';
      });
      // Filtramos de los que son elegidos por usuario
      this.listAdditionalChargesByUser = this.listAdditionalCharges.filter(function(i: any){
        return i.made_by === 'USUARIO';
      });
      // Validamos que hayan cargos automaticos y a todos le asignamos la propiedad del checkbox en desabilitado
      if(this.listAdditionalChargesByAuto.length > 0){
        for(var i in this.listAdditionalChargesByAuto){
          this.listAdditionalChargesByAuto[i].isChecked = false;
        }
      }
    });
  }

  // Se encarga de definir, agregar, quitar los paquetes
  packagesParam(): FormArray {
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

  // Se encarga de agregar, quitar y definir el arreglo de productos (mercancias)
  productsParam(): FormArray {
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

  // Limpia los campos origen
  setValueNullAddressOrigin() {
    this.firstFormGroup.get('branch_office_origin')?.reset();
    this.firstFormGroup.get('origin_postal_code')?.reset();
    this.firstFormGroup.get('origin_state')?.reset();
    this.firstFormGroup.get('origin_city')?.reset();
    this.firstFormGroup.get('origin_municipality')?.reset();
    this.firstFormGroup.get('origin_settlement')?.reset();
    this.origin_settlement = '';
    this.branch_office_origin = '';
    // this.listAddressUser = [];
  }

  // Limpia los campos destino 
  setValueNullAddressDestin() {
    this.firstFormGroup.get('branch_office_destin')?.reset();
    this.firstFormGroup.get('destin_postal_code')?.reset();
    this.firstFormGroup.get('destin_state')?.reset();
    this.firstFormGroup.get('destin_city')?.reset();
    this.firstFormGroup.get('destin_municipality')?.reset();
    this.firstFormGroup.get('destin_settlement')?.reset();
    this.destin_settlement = '';
    this.branch_office_destin = '';
    // this.listAddressUser = [];
  }

  // Limpia los productos
  setValueNullProductsCustomer() {
    this.firstFormGroup.get('id_products')?.reset();
    this.listServicesClient = [];
  }

  // Carga las direcciones del cliente selecciuonado
  changeUserSelected() {
    this.setValueNullAddressOrigin();
    this.setValueNullAddressDestin();
    this.setValueNullProductsCustomer();
    // Obtenemos los servicios y las direcciones del cliente
    this.apiCustomer.getInfoCustomer(parseInt(this.firstFormGroup.get('id_customer')?.value!)).subscribe((e: any) => {
      this.listServicesClient = e.data.profile.profile_services;
      this.listProducts       = e.data.products;
      this.listAddressUser    = e.data.contactsables;
        if(this.listAddressUser.length == 0) {
          this.toastr.warning(e.message, 'No se ha cargado información de contactos', {
            timeOut: 3000,
            enableHtml: true,
          });
        }
    });
  }

  // Setear los valores del codigo postal seleccionado de origen
  selectPostalCodeOrigin() {
    let id = this.valueSelectPostalCodeOrigin;
    let filterContact = this.listAddressUser.filter(function(item: any) {
      return item.id === id;
    });
    for(var item of filterContact) {
      this.branch_office_origin = item.contact.branch_office;
      for(var address of item.contact.addressables) {
        this.firstFormGroup.get('origin_postal_code')?.setValue(address.address.postal_code);
        this.firstFormGroup.get('origin_state')?.setValue(address.address.state);
        this.firstFormGroup.get('origin_city')?.setValue(address.address.city);
        this.firstFormGroup.get('origin_municipality')?.setValue(address.address.municipality);
        this.firstFormGroup.get('origin_settlement')?.setValue(address.address.settlement);
        this.origin_settlement = address.address.settlement;
      }
    }
  }

  // Setear los valores del codigo postal seleccionado del destino
  selectPostalCodeDestin() {
    let id = this.valueSelectPostalCodeDestin;
    let filterContact = this.listAddressUser.filter(function(item: any) {
      return item.id === id;
    });
    for(var item of filterContact) {
      this.branch_office_destin = item.contact.branch_office;
      for(var address of item.contact.addressables) {
        this.firstFormGroup.get('destin_postal_code')?.setValue(address.address.postal_code);
        this.firstFormGroup.get('destin_state')?.setValue(address.address.state);
        this.firstFormGroup.get('destin_city')?.setValue(address.address.city);
        this.firstFormGroup.get('destin_municipality')?.setValue(address.address.municipality);
        this.firstFormGroup.get('destin_settlement')?.setValue(address.address.settlement);
        this.destin_settlement = address.address.settlement;
      }
    }
  }

  // Agrupar los cargos adicionales seleccionados
  checkAdditionalCharge(item: any) {
    item.isChecked = !item.isChecked;
    if(item.isChecked) {
      this.chargesAdditionalChecked.push(item.slug);     
    }else{
      var index = this.chargesAdditionalChecked.indexOf(item.slug);
      this.chargesAdditionalChecked.splice(index, 1);
    }

    let insuranceIsTrue = this.chargesAdditionalChecked.find((i => i === 'seguro-de-envio'));
    if(insuranceIsTrue) {
        this.hiddenInputValueDeclared = false;
    }else{
      this.hiddenInputValueDeclared = true;
      this.firstFormGroup.get('insurance')?.setValue('');
    }
  }

  // Obtiene todos las colonias que concidadn con el código postal origen
  validateCPCreate_Origin() {
    if(!parseInt(this.firstFormGroup.get('origin_postal_code')?.value!)) {
      this.toastr.warning("EL código postal origen no es valido", 'Advertencia', {
        timeOut: 3000,
        enableHtml: true
      });
      this.firstFormGroup.get('origin_postal_code')?.setValue(null);
      return;
    }
    this.listSettlement_Origin = [];
    this.apiUtils.getAddressByPostalCode(parseInt(this.firstFormGroup.get('origin_postal_code')?.value!)).subscribe((e: any) => {
      if (e.result) {
        if (e.data.length === 0) {
          this.errorMessages = 'Codigo postal no encontrado.';
        }
        else {          
          this.address_origin = e.data;
          this.firstFormGroup.get('origin_state')?.setValue(this.address_origin[0].state);
          this.firstFormGroup.get('origin_city')?.setValue(this.address_origin[0].city);
          this.firstFormGroup.get('origin_municipality')?.setValue(this.address_origin[0].municipality);
          this.address_origin.forEach((e: any) => {
            if (!this.listSettlement_Origin.find(x => x.settlement == e.settlement)) {
              this.listSettlement_Origin.push({ id: e.id, settlement: e.settlement });
            }
          });
          this.errorMessages = '';
        }
      }
    })
  }

  // Obtiene todas las colonias que coincidan con el código postal destino
  validateCPCreate_Destiny() {
    if(!parseInt(this.firstFormGroup.get('destin_postal_code')?.value!)) {
      this.toastr.warning("EL código postal destino no es valido", 'Advertencia', {
        timeOut: 3000,
        enableHtml: true
      });
      this.firstFormGroup.get('destin_postal_code')?.setValue(null);
      return;
    }
    this.listSettlement_Destiny = [];
    this.apiUtils.getAddressByPostalCode(parseInt(this.firstFormGroup.get('destin_postal_code')?.value!)).subscribe((e: any) => {
      if (e.result) {
        if (e.data.length === 0) {
          this.errorMessages = 'Codigo postal no encontrado.';
        }
        else {
          this.address_destin = e.data;
          this.firstFormGroup.get('destin_state')?.setValue(this.address_destin[0].state);
          this.firstFormGroup.get('destin_city')?.setValue(this.address_destin[0].city);
          this.firstFormGroup.get('destin_municipality')?.setValue(this.address_destin[0].municipality);
          this.address_destin.forEach((e: any) => {
            if (!this.listSettlement_Destiny.find(x => x.settlement == e.settlement)) {
              this.listSettlement_Destiny.push({ id: e.id, settlement: e.settlement });
            }
          });
          this.errorMessages = '';
        }
      }
    });
  }

  // Obtener la colonia(texto) seleccionada de origen
  selectSettlementOrigin() {
    let colonia = this.firstFormGroup.get('origin_settlement')?.value;
    let selectSettlement = this.listSettlement_Origin.filter(function(i: any){
      return i.id === colonia;
    });
    for(var e of selectSettlement) {
      this.origin_settlement = e.settlement;
    }
  }

  // Obtener la colonia(texto) seleccionada de destino
  selectSettlementDestin() {
    let colonia = this.firstFormGroup.get('destin_settlement')?.value;
    let selectSettlement = this.listSettlement_Destiny.filter(function(i: any){
      return i.id === colonia;
    });
    for(var e of selectSettlement) {
      this.destin_settlement = e.settlement;
    }
  }

  // Valida antes de empezar a cotizar
  onSubmit() {
    this.listQuotesResponseAvailable    = [];
    this.listQuotesResponseNotAvailable = [];
    this.errorMessages = '';
    this.submittedForm = true;
    const form = this.firstFormGroup;
    if (form.invalid) {
      this.errorMessages = 'Verifica los datos ingresados.';
      return;
    }

    let _products: any[] = [];
    let _packages: any[] = [];

    // Agregamos los productos que haya seleccionado
    this.productsParam().value.forEach((i: any) => {
      _products.push(i);
    });
    // Agregamos los paquetes que haya ingresaod
    this.packagesParam().value.forEach((i: any) => {
      _packages.push(i);
    });
    // Agregamos los servicios que haya checkeado
    var _services: any = new Object();
    this.chargesAdditionalChecked.forEach(function(val){
      let name;
      name = val;
      _services[name] = true;
    })
    _services['value_declared'] = form.get('insurance')?.value;
    // Agregamos los cargos adicionales que haya checkeadop
    let _additionals: any[] = [];
    if(form.get('additionals')?.value.length > 0){
      form.get('additionals')?.value.forEach((i: any) => {
        _additionals.push(i);
      });
    }
    // Definimos el origen
    const _origin = {
      postal_code   : form.get('origin_postal_code')?.value,
      state         : form.get('origin_state')?.value,
      city          : form.get('origin_city')?.value,
      municipality  : form.get('origin_municipality')?.value,
      settlement    : this.origin_settlement,
      branch_office : this.branch_office_origin,
    };
    // Definimos el destino
    const _destin = {
      postal_code   : form.get('destin_postal_code')?.value,
      state         : form.get('destin_state')?.value,
      city          : form.get('destin_city')?.value,
      municipality  : form.get('destin_municipality')?.value,
      settlement    : this.destin_settlement,
      branch_office : this.branch_office_destin,
    };
    // Obtenemos los productos que haya seleccionado
    let id_products_selected: any[] = [];
    form.get('id_products')?.value.forEach((i: any) => {
      id_products_selected.push(i);
    });
    // Definimos la data a enviar con todos los datos
    const data = {
      id_customer   : form.get('id_customer')?.value,
      id_products   : id_products_selected,
      // ship_date     : form.get('ship_date')?.value,
      origin        : _origin,
      destin        : _destin,
      products      : _products,
      packages      : _packages,
      services      : _services,
      additionals   : _additionals,
    };
    if(!form.invalid){
      this.loading_quote = true;
      this.hiddenSteperNext = true;
    }
    
    // Consumimos el servicio web con los datos ingresados
    this.api_MeQuote.storeMeQuote(data).subscribe(
      (e: any) => {
        this.submittedForm = false;
        this.loading_quote = false;
        // Validamos si el resultado es correcto
        if (e.result) {
          this.toastr.success(e.message, 'Cotizaciones', {
            timeOut: 3000,
            enableHtml: true
          });
          this.hiddenSteperNext = false;
          // Recorremos las cotizaciones encontradas y las clasificamos por su estado
          for (let i of e.data) {
            if (i.status == 'DISPONIBLE') {
              this.listQuotesResponseAvailable.push(i);
            }else{
              this.listQuotesResponseNotAvailable.push(i);
            }
          }
        } else {
          this.toastr.error(e.message, 'Cotización', {
            timeOut: 3000,
            enableHtml: true
          });
        }
      },
      (error) => {
        this.loading_quote = false;
        let message = this.utils.getErrorMessage(error);
        this.errorMessages = message;
      }
    );
  }

  // Función que ordena la data por precio
  orderPrice() {
    if(this.orderByPrice) {
      let sortData = this.listQuotesResponseAvailable.sort((a, b) => a.numbers.total - b.numbers.total);
      this.listQuotesResponseAvailable = sortData;
    }else{
      let sortData = this.listQuotesResponseAvailable.sort((a, b) => b.numbers.total - a.numbers.total);
      this.listQuotesResponseAvailable = sortData;
    }
    this.orderByPrice = !this.orderByPrice;
  }

  // Función que ordena la data por fecha
  orderDate() {
    if(this.orderByDate) {
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

  // Se encarga de descargar el PDF de una guía
  downloadQuotePdf(id: any, filename: string = "cotizaciónPdf.pdf") {
    this.disabledBtnPdf = true;
    const headers = new HttpHeaders().set('Accept', 'application/octet-stream');
    this.http.get(this.urlEndPoint + '/quote/export-pdf/' + id, {headers, responseType: 'blob' as 'json'}).subscribe(
      (response: any) => {
        let dataType = response.type;
        let binaryData = [];
        binaryData.push(response);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
        downloadLink.setAttribute('download', filename);
        document.body.appendChild(downloadLink);
        downloadLink.click();
        this.disabledBtnPdf = false;
      }
    )
  }

  // visualizar las cotizaciones obtenidas
  openModalDetails(id: number) {
    this.dialog.open(MeQuoteDetailsComponent, {
      width: '80vw',
      data: { _id: id },
      disableClose: true
    });
  }

  createShipment(quote: any) {
    this.loading = true;
    this.quoteToShip = quote;
    this.thirdFormGroup.get('id_quote')?.setValue(quote.id);
    this.thirdFormGroup.get('id_customer')?.setValue(quote.customer_id);
    // Datos origen
    this.thirdFormGroup.get('origin_postal_code')?.setValue(quote.origin.postal_code);
    this.thirdFormGroup.get('origin_state')?.setValue(quote.origin.state);
    this.thirdFormGroup.get('origin_city')?.setValue(quote.origin.city);
    this.thirdFormGroup.get('origin_municipality')?.setValue(quote.origin.municipality);
    this.thirdFormGroup.get('origin_settlement')?.setValue(quote.origin.settlement);
    this.thirdFormGroup.get('origin_street')?.setValue(quote.origin.street);
    this.thirdFormGroup.get('origin_suburb')?.setValue(quote.origin.suburb);
    this.thirdFormGroup.get('origin_location')?.setValue(quote.origin.location);
    this.thirdFormGroup.get('origin_reference')?.setValue(quote.origin.reference);
    this.thirdFormGroup.get('origin_outdoor_number')?.setValue(quote.origin.outdoor_number);
    this.thirdFormGroup.get('origin_interior_number')?.setValue(quote.origin.interior_number);
    this.thirdFormGroup.get('origin_branch_office')?.setValue(quote.origin.branch_office);
    this.thirdFormGroup.get('origin_business')?.setValue(quote.origin.business);
    this.thirdFormGroup.get('origin_contact')?.setValue(quote.origin.contact);
    this.thirdFormGroup.get('origin_stall')?.setValue(quote.origin.stall);
    this.thirdFormGroup.get('origin_rfc')?.setValue(quote.origin.rfc);
    this.thirdFormGroup.get('origin_phone')?.setValue(quote.origin.phone);
    this.thirdFormGroup.get('origin_email')?.setValue(quote.origin.email);
    // datos destino
    this.thirdFormGroup.get('destin_postal_code')?.setValue(quote.destin.postal_code);
    this.thirdFormGroup.get('destin_state')?.setValue(quote.destin.state);
    this.thirdFormGroup.get('destin_city')?.setValue(quote.destin.city);
    this.thirdFormGroup.get('destin_municipality')?.setValue(quote.destin.municipality);
    this.thirdFormGroup.get('destin_settlement')?.setValue(quote.destin.settlement);
    this.thirdFormGroup.get('destin_street')?.setValue(quote.destin.street);
    this.thirdFormGroup.get('destin_suburb')?.setValue(quote.destin.suburb);
    this.thirdFormGroup.get('destin_location')?.setValue(quote.destin.location);
    this.thirdFormGroup.get('destin_reference')?.setValue(quote.destin.reference);
    this.thirdFormGroup.get('destin_outdoor_number')?.setValue(quote.destin.outdoor_number);
    this.thirdFormGroup.get('destin_interior_number')?.setValue(quote.destin.interior_number);
    this.thirdFormGroup.get('destin_branch_office')?.setValue(quote.destin.branch_office);
    this.thirdFormGroup.get('destin_business')?.setValue(quote.destin.business);
    this.thirdFormGroup.get('destin_contact')?.setValue(quote.destin.contact);
    this.thirdFormGroup.get('destin_stall')?.setValue(quote.destin.stall);
    this.thirdFormGroup.get('destin_rfc')?.setValue(quote.destin.rfc);
    this.thirdFormGroup.get('destin_phone')?.setValue(quote.destin.phone);
    this.thirdFormGroup.get('destin_email')?.setValue(quote.destin.email);
    this.loading = false;
  }

  // Aqui generamos la guia para enviar los datos
  generateGuideByQuote() {
    this.errorMessages = '';
    this.submittedForm = true;
    const form = this.thirdFormGroup;
    if (form.invalid) {
      this.errorMessages = 'Verifica los datos ingresados.';
      return;
    }
    // Definimos el origen
    const _origin = {
      postal_code     : (form.get('origin_postal_code')?.value).toString(),
      state           : form.get('origin_state')?.value,
      city            : form.get('origin_city')?.value,
      municipality    : form.get('origin_municipality')?.value,
      settlement      : form.get('origin_settlement')?.value,
      street          : form.get('origin_street')?.value,
      suburb          : form.get('origin_suburb')?.value,
      location        : form.get('origin_location')?.value,
      reference       : form.get('origin_reference')?.value,
      outdoor_number  : (form.get('origin_outdoor_number')?.value).toString(),
      interior_number : (form.get('origin_interior_number')?.value).toString(),
      branch_office   : form.get('origin_branch_office')?.value,
      business        : form.get('origin_business')?.value,
      contact         : form.get('origin_contact')?.value,
      stall           : form.get('origin_stall')?.value,
      rfc             : form.get('origin_rfc')?.value,
      phone           : (form.get('origin_phone')?.value).toString(),
      email           : form.get('origin_email')?.value,
    };
    // Definimos el destino
    const _destin = {
      postal_code     : (form.get('destin_postal_code')?.value).toString(),
      state           : form.get('destin_state')?.value,
      city            : form.get('destin_city')?.value,
      municipality    : form.get('destin_municipality')?.value,
      settlement      : form.get('destin_settlement')?.value,
      street          : form.get('destin_street')?.value,
      suburb          : form.get('destin_suburb')?.value,
      location        : form.get('destin_location')?.value,
      reference       : form.get('destin_reference')?.value,
      outdoor_number  : (form.get('destin_outdoor_number')?.value).toString(),
      interior_number : (form.get('destin_interior_number')?.value).toString(),
      branch_office   : form.get('destin_branch_office')?.value,
      business        : form.get('destin_business')?.value,
      contact         : form.get('destin_contact')?.value,
      stall           : form.get('destin_stall')?.value,
      rfc             : form.get('destin_rfc')?.value,
      phone           : (form.get('destin_phone')?.value).toString(),
      email           : form.get('destin_email')?.value,
    };
    // Definimos la data a enviar con todos los datos
    const dataRequest = {
      id_quote      : form.get('id_quote')?.value,
      id_customer   : form.get('id_customer')?.value,
      origin        : _origin,
      destin        : _destin,
      packages      : this.quoteToShip.packages,
      services      : this.quoteToShip.services,
      additionals   : this.quoteToShip.charges,
    };
    this.loading_ship = true;
    // Consumimos el servicio para generar un envío
    this.api_MeQuote.storeMeShipment(dataRequest).subscribe(
      (e: any) => {
        this.loading_ship = false;
        if (e.result) {
          this.toastr.success(e.message, 'Envio generado', {
            timeOut: 3000,
            enableHtml: true
          });
          this.dialogRef.close(true);
        } else {
          this.toastr.warning(e.message, 'Advertencia', {
            timeOut: 3000,
            enableHtml: true
          });
        }
      },
      (error) => {
        this.loading_ship = false;
        let message = this.utils.getErrorMessage(error);
        this.errorMessages = message;
        this.toastr.error(message, 'Error', {
          timeOut: 3000,
          enableHtml: true
        });
      }
    );
  }
}
