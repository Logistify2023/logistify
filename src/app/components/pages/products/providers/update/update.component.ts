import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { Utils } from 'src/app/common/utils';
import { ProductService } from 'src/app/services/product.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  templateUrl: './update.component.html'
})
export class ProvidersUpdateComponent implements OnInit {
  updateForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;

  listStates: any[] = [];
  listCities: any[] = [];
  listMunicipalities: any[] = [];
  listSettlement: any[] = [];

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ProvidersUpdateComponent>,
    private formBuilder: FormBuilder,
    private apiProduct: ProductService,
    private apiUtils: UtilsService,
    private utils: Utils,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.updateForm = formBuilder.group({
      id: new FormControl('', [Validators.required]),
      business_name: new FormControl('', [Validators.required]),
      url: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      street: new FormControl('', []),
      suburb: new FormControl('', []),
      location: new FormControl('', []),
      reference: new FormControl('', []),
      outdoor_number: new FormControl('', [Validators.required]),
      interior_number: new FormControl('', []),
      postal_code: new FormControl('', [Validators.required]),
      id_postal_code: new FormControl('', []),
      status: new FormControl('', [Validators.required]),
      estado: new FormControl('', []),
      ciudad: new FormControl('', []),
      municipio: new FormControl('', []),
    });
  }

  ngOnInit(): void {
    this.apiProduct.getProviderByID(this.data._id, true, false, this.data.dataDeleted).subscribe((e: any) => {
      if (e.result) {
        this.updateForm.setValue({
          id: e.data.id,
          business_name: e.data.business_name,
          url: e.data.url,
          description: e.data.description,
          street: e.data.addressables[0].street,
          suburb: e.data.addressables[0].suburb,
          location: e.data.addressables[0].location,
          reference: e.data.addressables[0].reference,
          outdoor_number: e.data.addressables[0].outdoor_number,
          interior_number: e.data.addressables[0].interior_number,
          postal_code: e.data.addressables[0].address.postal_code,
          id_postal_code: e.data.addressables[0].address.id,
          status: e.data.status == 'DISPONIBLE' ? true : false,

          estado: '',
          ciudad: '',
          municipio: '',
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
        if (e.data.length === 0) {
          this.errorMessages = 'No se encontro el código postal';
        }
        else {
          this.listSettlement = e.data;

          this.updateForm.get('estado')?.setValue(this.listSettlement[0].state);
          this.updateForm.get('ciudad')?.setValue(this.listSettlement[0].city);
          this.updateForm.get('municipio')?.setValue(this.listSettlement[0].municipality);

          this.listSettlement.forEach((e: any) => {
            if (!this.listSettlement.find(x => x.settlement == e.settlement)) {
              this.listSettlement.push({ id: e.c_settlement_type, settlement: e.settlement });
            }
          });
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
      business_name: form.get('business_name')?.value,
      url: form.get('url')?.value,
      description: form.get('description')?.value,
      street: form.get('street')?.value,
      suburb: form.get('suburb')?.value,
      location: form.get('location')?.value,
      reference: form.get('reference')?.value,
      outdoor_number: form.get('outdoor_number')?.value,
      interior_number: form.get('interior_number')?.value,
      postal_code: form.get('postal_code')?.value,
      id_postal_code: form.get('id_postal_code')?.value,
      status: (form.get('status')?.value) ? '1' : '0',
    };

    this.apiProduct.updateProvider(data).subscribe(
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
