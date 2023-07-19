import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { CustomerService } from 'src/app/services/customer.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  templateUrl: './update.component.html'
})

export class ClientsUpdateComponent implements OnInit {
  firstFormGroup: FormGroup;
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

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ClientsUpdateComponent>,
    private formBuilder: FormBuilder,
    private apiCustomer: CustomerService,
    private apiUtils: UtilsService,
    private utils: Utils,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.firstFormGroup = this.formBuilder.group({
      id: new FormControl('', [Validators.required]),
      rfc: new FormControl('', [Validators.nullValidator]),
      business_name: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      surname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.minLength(10)]),
      executive: new FormControl('', [Validators.required]),
      profile_id: new FormControl('', [Validators.required]),
      turn_id: new FormControl('', [Validators.required]),
      customer_type_id: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.nullValidator]),
      type_custumer: new FormControl('', []),
      status: new FormControl('', [])
    });
  }

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
    this.apiCustomer.getClients(this.data._id, true, true, true, false, false, false, true, true, false, false, false, true, false, false, false, false, false, this.data.dataDeleted).subscribe((e: any) => {
      if (e.result) {
        this.firstFormGroup.setValue({
          id: e.data.id,
          rfc: e.data.rfc,
          business_name: e.data.business_name,
          name: e.data.your_account[0].name,
          lastname: e.data.your_account[0].lastname,
          surname: e.data.your_account[0].surname,
          email: e.data.your_account[0].email,
          phone: e.data.your_account[0].phone,
          executive: (e.data.is_assigned.length > 0) ? e.data.is_assigned[0].id: '',
          profile_id: e.data.profile_id,
          turn_id: e.data.turn_id,
          customer_type_id: e.data.customer_type_id,
          description: e.data.your_account[0].account.description,
          type_custumer: e.data.type_custumer,
          status: (e.data.status == 'DISPONIBLE') ? true : false,
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

  validateRFC() {
    if (this.firstFormGroup.get('rfc')?.value) {
      this.apiCustomer.validateRFC(this.firstFormGroup.get('rfc')?.value!).subscribe((e: any) => {
        if (e.data.length > 0) {
          this.errorMessages = 'RFC no válido.';
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
    if (this.firstFormGroup.invalid ) {
      console.log(this.firstFormGroup);
      this.errorMessages = 'Verifica los datos.';
      return;
    }
    const data = {
      id: this.firstFormGroup.get('id')?.value,
      rfc: this.firstFormGroup.get('rfc')?.value,
      business_name: this.firstFormGroup.get('business_name')?.value,
      description: this.firstFormGroup.get('description')?.value,
      profile_id: this.firstFormGroup.get('profile_id')?.value,
      customer_type_id: this.firstFormGroup.get('customer_type_id')?.value,
      type_custumer: this.firstFormGroup.get('type_custumer')?.value,
      turn_id: this.firstFormGroup.get('turn_id')?.value,
      name: this.firstFormGroup.get('name')?.value,
      lastname: this.firstFormGroup.get('lastname')?.value,
      surname: this.firstFormGroup.get('surname')?.value,
      email: this.firstFormGroup.get('email')?.value,
      phone: this.firstFormGroup.get('phone')?.value,
      executive: this.firstFormGroup.get('executive')?.value,
      status: (this.firstFormGroup.get('status')?.value) ? '1' : '0',
    };
    this.apiCustomer.updateCustomer(data).subscribe(
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