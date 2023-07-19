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
export class BranchOfficesUpdateComponent implements OnInit {
  updateForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;

  listOfficeType: any[] = [];
  listSettlement: any[] = [];
  listCustomers: any[] = [];

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<BranchOfficesUpdateComponent>,
    private formBuilder: FormBuilder,
    private apiCustomer: CustomerService,
    private apiUtils: UtilsService,
    private utils: Utils,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.updateForm = formBuilder.group({
      id: new FormControl('', [Validators.required]),
      branch_office: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      reference: new FormControl('', [Validators.required]),
      branch_office_type_id: new FormControl('', [Validators.required]),
      customer_id: new FormControl('', [Validators.required]),
      street: new FormControl('', [Validators.required]),
      suburb: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required]),
      outdoor_number: new FormControl('', [Validators.required]),
      interior_number: new FormControl('', [Validators.required]),
      postal_code: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required]),
      estado: new FormControl('', []),
      ciudad: new FormControl('', []),
      municipio: new FormControl('', []),
    });
  }

  ngOnInit(): void {
    this.apiCustomer.getBrandOfficeType().subscribe((e: any) => {
      if (e.result) {
        this.listOfficeType = e.data;
      }
    })
    this.apiCustomer.getClients().subscribe((e: any) => {
      this.listCustomers = e.data;
    });
    this.apiCustomer.getBrandOffices(this.data._id, false, true, true, true, this.data.dataDeleted).subscribe((e: any) => {
      if (e.result) {
        this.updateForm.setValue({
          id: e.data.id,
          branch_office: e.data.branch_office,
          description: e.data.description,
          reference: e.data.reference,
          branch_office_type_id: e.data.branch_office_type_id,
          customer_id: (e.data.customers) ? e.data.customers[0].id : 0,
          street: (e.data.addressables) ? e.data.addressables[0].street : '',
          suburb: (e.data.addressables) ? e.data.addressables[0].suburb : '',
          location: (e.data.addressables) ? e.data.addressables[0].location : '',
          outdoor_number: (e.data.addressables) ? e.data.addressables[0].outdoor_number : '',
          interior_number: (e.data.addressables) ? e.data.addressables[0].interior_number : '',
          postal_code: (e.data.addressables) ? (e.data.addressables[0].address) ? e.data.addressables[0].address.postal_code : '' : '',
          status: (e.data.status == 'DISPONIBLE') ? true : false,
          estado: (e.data.addressables) ? (e.data.addressables[0].address) ? e.data.addressables[0].address.state : '' : '',
          ciudad: (e.data.addressables) ? (e.data.addressables[0].address) ? e.data.addressables[0].address.city : '' : '',
          municipio: (e.data.addressables) ? (e.data.addressables[0].address) ? e.data.addressables[0].address.municipality : '' : '',
        });
        this.validateCP();
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

  validateCP() {
    this.apiUtils.getAddressByPostalCode(this.updateForm.get('postal_code')?.value).subscribe((e: any) => {
      if (e.result) {
        if (e.data.data.length === 0) {
          this.errorMessages = 'No se encontro el código postal';
        }
        else {
          this.listSettlement = e.data.data;
          this.updateForm.get('estado')?.setValue(this.listSettlement[0].state);
          this.updateForm.get('ciudad')?.setValue(this.listSettlement[0].city);
          this.updateForm.get('municipio')?.setValue(this.listSettlement[0].municipality);
          this.errorMessages = '';
        }
      }
    })
  }
  onSubmit() {
    this.errorMessages = '';
    const form = this.updateForm;
    this.submittedForm = true;

    if (form.invalid) {
      this.errorMessages = 'Verifica los datos.';
      return;
    }

    const data = {
      id: form.get('id')?.value,
      branch_office: form.get('branch_office')?.value,
      description: form.get('description')?.value,
      reference: form.get('reference')?.value,
      branch_office_type_id: form.get('branch_office_type_id')?.value,
      customer_id: form.get('customer_id')?.value,
      street: form.get('street')?.value,
      suburb: form.get('suburb')?.value,
      location: form.get('location')?.value,
      outdoor_number: form.get('outdoor_number')?.value,
      interior_number: form.get('interior_number')?.value,
      postal_code: form.get('postal_code')?.value,
      id_postal_code: this.listSettlement.find(x => x.settlement == form.get('suburb')?.value).id,
      status: (form.get('status')?.value) ? '1' : '0',
    };

    this.apiCustomer.updateBrandOffice(data).subscribe(
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
