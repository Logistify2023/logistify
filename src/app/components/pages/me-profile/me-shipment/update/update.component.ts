import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { CustomerService } from 'src/app/services/customer.service';
import { MessengerService } from 'src/app/services/messenger.service';
import { ShipmentsService } from 'src/app/services/shipments.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-receivers-update',
  templateUrl: './update.component.html'
})
export class MeShipmentUpdateComponent implements OnInit {
  updateForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;
  branch_office_origin: string = '';
  branch_office_destin: string = '';
  origin_settlement:    string = '';
  destin_settlement:    string = '';
  listProducts:           any[] = [];
  address_origin:         any[] = [];
  address_destin:         any[] = [];
  listSettlement_Origin:  any[] = [];
  listSettlement_Destiny: any[] = [];
  listAddressUser:        any[] = [];
  listAdditionalCharges:        any[] = [];
  listAdditionalChargesByAuto:  any[] = [];
  listAdditionalChargesByUser:  any[] = [];
  chargesAdditionalChecked:     any[] = [];
  valueSelectPostalCodeOrigin:  string = '';
  valueSelectPostalCodeDestin:  string = '';
  hiddenInputValueDeclared = true;
  isCheckedOriginCheck: boolean = false;
  isCheckedDestinCheck: boolean = false;
  
  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<MeShipmentUpdateComponent>,
    private formBuilder: FormBuilder,
    private apiShipments: ShipmentsService,
    private apiUtils: UtilsService,
    private utils: Utils,
    private apiCustomer: CustomerService,
    private apiMessenger: MessengerService, 
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.updateForm = formBuilder.group({
      id_customer: new FormControl('', [Validators.required]),
      branch_office_origin: new FormControl('', [Validators.nullValidator]),
      branch_office_destin: new FormControl('', [Validators.nullValidator]),
      origin_postal_code: new FormControl('', [Validators.required]),
      origin_state: new FormControl('', [Validators.required]),
      origin_city: new FormControl('', [Validators.required]),
      origin_municipality: new FormControl('', [Validators.required]),
      origin_settlement: new FormControl('', [Validators.nullValidator]),
      destin_postal_code: new FormControl('', [Validators.required]),
      destin_state: new FormControl('', [Validators.required]),
      destin_city: new FormControl('', [Validators.required]),
      destin_municipality: new FormControl('', [Validators.required]),
      destin_settlement: new FormControl('', [Validators.nullValidator]),
      insurance: new FormControl('', [Validators.nullValidator]),
      ship_date: new FormControl('', [Validators.required]),
      products: this.formBuilder.array([]),
      packages: this.formBuilder.array([]),
      additionals: new FormControl('', []),
    });
  }

  ngOnInit(): void {
    this.hiddenInputValueDeclared = true;
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

    this.apiShipments.getQuote(this.data._id, false, true, false, true, this.data.dataDeleted).subscribe((e: any) => {
      if (e.result) {
        console.log(e.data)
        let data = e.data;
        this.apiCustomer.getClients(data.customer_id, false, false, false, false, false, false, false, false, false, true, false, false, false, true, true, false, false, false, false).subscribe((e: any) => {
          this.listAddressUser = e.data.contactsables;
          // console.log(this.listAddressUser)
        });
        if(e.data.origin.branch_office == null){
          this.isCheckedOriginCheck = true
        }
        if(e.data.destin.branch_office == null){
          this.isCheckedDestinCheck = true
        }

        this.updateForm.setValue({
          id_customer: data.customer.business_name,
          branch_office_origin: data.origin.branch_office,
          branch_office_destin: data.destin.branch_office,
          ship_date: data.dates.quote_start,
          origin_postal_code: data.origin.postal_code,
          origin_state: data.origin.state,
          origin_city: data.origin.city,
          origin_municipality: data.origin.municipality,
          origin_settlement: data.origin.settlement,
          destin_postal_code: data.destin.postal_code,
          destin_state: data.destin.state,
          destin_city: data.destin.city,
          destin_municipality: data.destin.municipality,
          destin_settlement: data.destin.settlement,
          // origin_settlement: '',
          insurance: '',
          products: '',
          packages: '',
          additionals: '',
        });
      } else {
        this.toastr.error(e.message, 'Error', {
          timeOut: 3000,
          enableHtml: true
        });
      }
    }, (err: any) => {
      this.toastr.error(err.error.message, 'Error', {
        timeOut: 3000,
        enableHtml: true
      });
    });
  }

  packagesParam(): FormArray { //FormArray
    return this.updateForm.get("packages") as FormArray
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
    return this.updateForm.get("products") as FormArray
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

  validateCPCreate_Origin() {
    this.apiUtils.getAddressByPostalCode(this.updateForm.get('origin_postal_code')?.value).subscribe((e: any) => {
      if (e.result) {
        if (e.data.data.length === 0) {
          this.errorMessages = 'Codigo postal no encontrado.';
        }
        else {
          this.address_origin = e.data;
          this.updateForm.get('origin_state')?.setValue(this.address_origin[0].state);
          this.updateForm.get('origin_city')?.setValue(this.address_origin[0].city);
          this.updateForm.get('origin_municipality')?.setValue(this.address_origin[0].municipality);
          this.listSettlement_Origin.forEach((e: any) => {
            if (!this.listSettlement_Origin.find(x => x.settlement == e.settlement)) {
              this.listSettlement_Origin.push({ id: e.c_settlement_type, settlement: e.settlement });
            }
          });
          this.errorMessages = '';
        }
      }
    })
  }

  validateCPCreate_Destiny() {
    this.apiUtils.getAddressByPostalCode(this.updateForm.get('destin_postal_code')?.value).subscribe((e: any) => {
      if (e.result) {
        if (e.data.data.length === 0) {
          this.errorMessages = 'Codigo postal no encontrado.';
        }
        else {
          this.address_destin = e.data;
          this.updateForm.get('destin_state')?.setValue(this.address_destin[0].state);
          this.updateForm.get('destin_city')?.setValue(this.address_destin[0].city);
          this.updateForm.get('destin_municipality')?.setValue(this.address_destin[0].municipality);
          this.listSettlement_Destiny.forEach((e: any) => {
            if (!this.listSettlement_Destiny.find(x => x.settlement == e.settlement)) {
              this.listSettlement_Destiny.push({ id: e.c_settlement_type, settlement: e.settlement });
            }
          });
          this.errorMessages = '';
        }
      }
    })
  }
 
  checkBoxAddressOrigin(){
    // this.isCheckedOriginCheck = true;
    console.log(this.isCheckedOriginCheck);
    if(this.isCheckedOriginCheck == false){
      this.isCheckedOriginCheck = true;
    }else{
      this.isCheckedOriginCheck = false;
    }

    this.updateForm.get('branch_office_origin')?.setValue('');
    this.updateForm.get('origin_postal_code')?.setValue('');
    this.updateForm.get('origin_state')?.setValue('');
    this.updateForm.get('origin_city')?.setValue('');
    this.updateForm.get('origin_municipality')?.setValue('');
    this.updateForm.get('origin_settlement')?.setValue('');
    this.origin_settlement = '';
    this.branch_office_origin = '';

  }
  // selectPostalCodeOrigin(){

  // }
  selectSettlementOrigin(){


  }
  checkBoxAddressDestin(){
    console.log(this.isCheckedDestinCheck);
    if(this.isCheckedDestinCheck == false){
      this.isCheckedDestinCheck = true;
    }else{
      this.isCheckedDestinCheck = false;
    }
    
    this.updateForm.get('branch_office_destin')?.setValue('');
    this.updateForm.get('destin_postal_code')?.setValue('');
    this.updateForm.get('destin_state')?.setValue('');
    this.updateForm.get('destin_city')?.setValue('');
    this.updateForm.get('destin_municipality')?.setValue('');
    this.updateForm.get('destin_settlement')?.setValue('');
    this.destin_settlement = '';
    this.branch_office_destin = '';

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
        this.updateForm.get('origin_postal_code')?.setValue(address.address.postal_code);
        this.updateForm.get('origin_state')?.setValue(address.address.state);
        this.updateForm.get('origin_city')?.setValue(address.address.city);
        this.updateForm.get('origin_municipality')?.setValue(address.address.municipality);
        this.updateForm.get('origin_settlement')?.setValue(address.address.settlement);
        this.origin_settlement = address.address.settlement;
       
      }
    }
  }

  selectPostalCodeDestin(){
    let id = this.valueSelectPostalCodeDestin;
    let filterContact = this.listAddressUser.filter(function(item: any) {
      return item.id === id;
    });
    for(var item of filterContact){
      this.branch_office_destin = item.contact.branch_office;
      for(var address of item.contact.addressables){

        this.updateForm.get('destin_postal_code')?.setValue(address.address.postal_code);
        this.updateForm.get('destin_state')?.setValue(address.address.state);
        this.updateForm.get('destin_city')?.setValue(address.address.city);
        this.updateForm.get('destin_municipality')?.setValue(address.address.municipality);
        this.updateForm.get('destin_settlement')?.setValue(address.address.settlement);
        this.destin_settlement = address.address.settlement;

      }
    }
  }
  selectSettlementDestin(){

  }
  checkAdditionalCharge(item: any){

  }


  onSubmit() {
    this.errorMessages = '';
    const form = this.updateForm;
    this.submittedForm = true;

    if (form.invalid) {
      this.errorMessages = 'Verifica los datos.';
      return;
    }

    // let _products: any[] = [];
    // let _packages: any[] = [];
    // const data = {
    //   id_customer: form.get('business_name')?.value,
    //   campaign: form.get('business_name')?.value,
    //   description: form.get('business_name')?.value,
    //   insurance: form.get('business_name')?.value,
    //   ship_date: form.get('business_name')?.value,

    //   origin_postal_code: form.get('business_name')?.value,
    //   origin_state: form.get('business_name')?.value,
    //   origin_city: form.get('business_name')?.value,
    //   origin_municipality: form.get('business_name')?.value,
    //   origin_settlement: form.get('business_name')?.value,
    //   origin_street: form.get('business_name')?.value,
    //   origin_outdoor_number: form.get('business_name')?.value,
    //   origin_interior_number: form.get('business_name')?.value,

    //   destin_postal_code: form.get('business_name')?.value,
    //   destin_state: form.get('business_name')?.value,
    //   destin_city: form.get('business_name')?.value,
    //   destin_municipality: form.get('business_name')?.value,
    //   destin_settlement: form.get('business_name')?.value,
    //   destin_street: form.get('business_name')?.value,
    //   destin_outdoor_number: form.get('business_name')?.value,
    //   destin_interior_number: form.get('business_name')?.value,

    //   products: _products,
    //   packages: _packages,
    // };

    var data = {};

    this.apiShipments.updateQuote(data).subscribe(
      (e: any) => {
        this.submittedForm = false;
        if (e.result) {
          this.toastr.success(e.message, 'Actualización', {
            timeOut: 3000,
            enableHtml: true
          });
          this.dialogRef.close();
        } else {
          this.toastr.error(e.message, 'Actualización', {
            timeOut: 3000,
            enableHtml: true
          });
        }
      },
      (error) => {
        let message = this.utils.getErrorMessage(error);
        this.errorMessages = message;
      }
    );
  }

}
