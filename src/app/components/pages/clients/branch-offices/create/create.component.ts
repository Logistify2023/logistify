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
export class BranchOfficesCreateComponent {
  createForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;

  listOfficeType: any[] = [];
  listSettlement: any[] = [];
  listCustomers: any[] = [];


  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<BranchOfficesCreateComponent>,
    private formBuilder: FormBuilder,
    private apiCustomer: CustomerService,
    private apiUtils: UtilsService,
    private utils: Utils,
    public dialog: MatDialog) {
    this.createForm = formBuilder.group({
      branch_office: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      reference: new FormControl('', [Validators.required]),
      branch_office_type_id: new FormControl('', [Validators.required]),
      customer_id: new FormControl('', [Validators.required]),
      street: new FormControl('', [Validators.required]),
      suburb: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required]),
      outdoor_number: new FormControl('', [Validators.required]),
      interior_number: new FormControl('', []),
      postal_code: new FormControl('', [Validators.required]),
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
  }

  validateCP() {
    this.apiUtils.getAddressByPostalCode(this.createForm.get('postal_code')?.value).subscribe((e: any) => {
      if (e.result) {
        if (e.data.data.length === 0) {
          this.errorMessages = 'No se encontro el código postal';
        }
        else {
          this.listSettlement = e.data.data;
          this.createForm.get('estado')?.setValue(this.listSettlement[0].state);
          this.createForm.get('ciudad')?.setValue(this.listSettlement[0].city);
          this.createForm.get('municipio')?.setValue(this.listSettlement[0].municipality);
          this.errorMessages = '';
        }
      }
    })
  }
  onSubmit() {
    this.errorMessages = '';
    this.submittedForm = true;
    const form = this.createForm;

    if (form.invalid) {
      console.log(form);
      this.errorMessages = 'Verifica los datos.';
      return;
    }

    const data = {
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
    };

    this.apiCustomer.storeBrandOffice(data).subscribe(
      (e: any) => {
        this.submittedForm = false;
        if (e.result) {
          this.toastr.success(e.message, 'Contactos', {
            timeOut: 3000,
            enableHtml: true
          });
          this.dialogRef.close();
        } else {
          this.toastr.error(e.message, 'Contactos', {
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
