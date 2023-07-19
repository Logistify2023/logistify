import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, map, Observable, of, startWith } from 'rxjs';
import { Utils } from 'src/app/common/utils';
import { ProductService } from 'src/app/services/product.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  templateUrl: './create.component.html',
  styleUrls: []
})
export class ProvidersCreateComponent {
  createForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;

  listStates: any[] = [];
  listCities: any[] = [];
  listMunicipalities: any[] = [];
  listSettlement: any[] = [];

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ProvidersCreateComponent>,
    private formBuilder: FormBuilder,
    private apiProduct: ProductService,
    private apiUtils: UtilsService,
    private utils: Utils,
    public dialog: MatDialog) {
    this.createForm = formBuilder.group({
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
      estado: new FormControl('', []),
      ciudad: new FormControl('', []),
      municipio: new FormControl('', []),
    });
  }

  ngOnInit(): void {
  }

  validateCP() {
    this.apiUtils.getAddressByPostalCode(this.createForm.get('postal_code')?.value).subscribe((e: any) => {
      if (e.result) {
        if (e.data.length === 0) {
          this.errorMessages = 'No se encontro el código postal';
        }
        else {
          this.listSettlement = e.data;
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
      id_postal_code: this.listSettlement.find(x => x.settlement == this.createForm.get('suburb')?.value).id,
    };

    this.apiProduct.storeProvider(data).subscribe(
      (e: any) => {
        this.submittedForm = false;
        if (e.result) {
          this.toastr.success(e.message, 'Estado', {
            timeOut: 3000,
            enableHtml: true
          });
          this.dialogRef.close();
        } else {
          this.toastr.error(e.message, 'Estado', {
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
