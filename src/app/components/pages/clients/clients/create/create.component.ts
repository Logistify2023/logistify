import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { CustomerService } from 'src/app/services/customer.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  templateUrl: './create.component.html',
  styleUrls: []
})

export class ClientsCreateComponent {
  createForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;

  listExecutives: any[] = [];
  listStates: any[] = [];
  listCities: any[] = [];
  listMunicipalities: any[] = [];
  listTurns: any[] = [];
  listCustomerTypes: any[] = [];
  listProfiles: any[] = [];
  listSettlement: any[] = [];

  listOfficeType: any[] = [];

  firstFormGroup = this.formBuilder.group({
    rfc: new FormControl('', [Validators.nullValidator]),
    business_name: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.minLength(10)]),
    sex: new FormControl('', [Validators.required]),
    executive: new FormControl('', [Validators.required]),
  });
  secondFormGroup = this.formBuilder.group({
    profile_id: new FormControl('', [Validators.required]),
    turn_id: new FormControl('', [Validators.required]),
    customer_type_id: new FormControl('', [Validators.required]),
    street: new FormControl('', [Validators.required]),
    suburb: new FormControl('', [Validators.required]),
    reference: new FormControl('', [Validators.required]),
    outdoor_number: new FormControl('', [Validators.required]),
    interior_number: new FormControl('', []),
    postal_code: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.nullValidator]),
    type_custumer: new FormControl('', []),
    id_postal_code: new FormControl('', []),
    state: new FormControl('', []),
    city: new FormControl('', []),
    municipality: new FormControl('', []),
  });

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ClientsCreateComponent>,
    private formBuilder: FormBuilder,
    private apiCustomer: CustomerService,
    private apiUtils: UtilsService,
    private utils: Utils,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.apiCustomer.getExecutives().subscribe((e: any) => {
      if (e.result) {
        if (e.data.length > 0) {
          e.data.forEach((rol: any) => {
            rol.users.forEach((user: any) => {
              if (!this.listExecutives.find(x => x.id == user.id)) {
                this.listExecutives.push(user);
              }
            });
          });
        }
      }
    });
    this.apiCustomer.getTurns().subscribe((e: any) => {
      if (e.result) {
        this.listTurns = e.data;
      }
    });
    this.apiCustomer.getClientsTypes().subscribe((e: any) => {
      if (e.result) {
        this.listCustomerTypes = e.data;
      }
    });
    this.apiCustomer.getClientsProfiles().subscribe((e: any) => {
      if (e.result) {
        this.listProfiles = e.data;
      }
    });
  }

  validateCP() {
    this.apiUtils.getAddressByPostalCode(this.secondFormGroup.get('postal_code')?.value!).subscribe((e: any) => {
      if (e.result) {
        if (e.data.length === 0) {
          this.errorMessages = 'No se encontro el código postal';
        }
        else {
          this.listSettlement = e.data;
          this.secondFormGroup.get('state')?.setValue(this.listSettlement[0].state);
          this.secondFormGroup.get('city')?.setValue(this.listSettlement[0].city);
          this.secondFormGroup.get('municipality')?.setValue(this.listSettlement[0].municipality);
          this.errorMessages = '';
        }
      }
    });
  }

  validateRFC() {
    if (this.firstFormGroup.get('rfc')?.value) {
      this.apiCustomer.validateRFC(this.firstFormGroup.get('rfc')?.value!).subscribe((e: any) => {
        if (e.data.length > 0) {
          this.errorMessages = 'Código Postal no válido.';
        }
        else {
          this.errorMessages = '';
        }
      });
    }
  }

  onSubmit() {
    this.errorMessages = '';
    this.submittedForm = true;

    if (this.firstFormGroup.invalid && this.secondFormGroup.invalid) {
      console.log(this.firstFormGroup);
      console.log(this.secondFormGroup);
      this.errorMessages = 'Verifica los datos.';
      return;
    }

    const date = new Date();
    const data = {
      rfc: this.firstFormGroup.get('rfc')?.value,
      business_name: this.firstFormGroup.get('business_name')?.value,
      cfdi: 'Esto es el CFDI de la empresa',
      description: this.secondFormGroup.get('description')?.value,
      expiration_date: date.getFullYear() + '/' + (date.getMonth() + 2) + '/' + date.getDate(),
      has_products: false,
      profile_id: this.secondFormGroup.get('profile_id')?.value,
      customer_type_id: this.secondFormGroup.get('customer_type_id')?.value,
      type_custumer: this.secondFormGroup.get('type_custumer')?.value,
      turn_id: this.secondFormGroup.get('turn_id')?.value,
      name: this.firstFormGroup.get('name')?.value,
      lastname: this.firstFormGroup.get('lastname')?.value,
      surname: this.firstFormGroup.get('surname')?.value,
      email: this.firstFormGroup.get('email')?.value,
      phone: this.firstFormGroup.get('phone')?.value,
      sex: this.firstFormGroup.get('sex')?.value,
      executive: this.firstFormGroup.get('executive')?.value,
      street: this.secondFormGroup.get('street')?.value,
      suburb: this.secondFormGroup.get('suburb')?.value,
      reference: this.secondFormGroup.get('reference')?.value,
      outdoor_number: this.secondFormGroup.get('outdoor_number')?.value,
      interior_number: this.secondFormGroup.get('interior_number')?.value,
      postal_code: (this.secondFormGroup.get('postal_code')?.value)?.toString(),
      id_postal_code: this.listSettlement.find(x => x.settlement == this.secondFormGroup.get('suburb')?.value).id,
    };
    
    this.apiCustomer.storeCustomer(data).subscribe(
      (e: any) => {
        this.submittedForm = false;
        if (e.result) {
          this.toastr.success(e.message, 'Cliente', {
            timeOut: 3000,
            enableHtml: true,
          });
          this.dialogRef.close();
        } else {
          this.toastr.error(e.message, 'Cliente', {
            timeOut: 3000,
            enableHtml: true,
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