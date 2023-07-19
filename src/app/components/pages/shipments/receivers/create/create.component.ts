import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { ShipmentsService } from 'src/app/services/shipments.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-receivers-create',
  templateUrl: './create.component.html',
  styleUrls: []
})
export class ReceiversCreateComponent {
  createForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;
  listSettlement: any[] = [];
  listStates: any[] = [];
  listCities: any[] = [];
  listMunicipalities: any[] = [];

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ReceiversCreateComponent>,
    private formBuilder: FormBuilder,
    private apiShipments: ShipmentsService,
    private apiUtils: UtilsService,
    private utils: Utils,
    public dialog: MatDialog) {
    this.createForm = formBuilder.group({
      business_name: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      surname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      street: new FormControl('', [Validators.required]),
      suburb: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required]),
      outdoor_number: new FormControl('', [Validators.required]),
      interior_number: new FormControl('', [Validators.required]),
      postal_code: new FormControl('', [Validators.required]),
    });
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
      name: form.get('name')?.value,
      surname: form.get('surname')?.value,
      lastname: form.get('lastname')?.value,
      phone: form.get('phone')?.value,
      email: form.get('email')?.value,
      street: form.get('street')?.value,
      suburb: form.get('suburb')?.value,
      location: form.get('location')?.value,
      outdoor_number: form.get('outdoor_number')?.value,
      interior_number: form.get('interior_number')?.value,
      postal_code: form.get('postal_code')?.value,
      id_postal_code: this.listSettlement.find(x => x.settlement == this.createForm.get('suburb')?.value).id,
    };

    this.apiShipments.storeReceivers(data).subscribe(
      (e: any) => {
        this.submittedForm = false;
        if (e.result) {
          this.toastr.success(e.message, 'Receptores', {
            timeOut: 3000,
            enableHtml: true
          });
          this.dialogRef.close();
        } else {
          this.toastr.error(e.message, 'Receptores', {
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

  validateCPCreate() {
    this.apiUtils.getAddressByPostalCode(this.createForm.get('postal_code')?.value).subscribe((e: any) => {
      if (e.result) {
        if (e.data.data.length === 0) {
          this.errorMessages = 'Codigo postal no encontrado.';
        }
        else {
          this.listSettlement = e.data.data;
          this.listSettlement.forEach((e: any) => {
            if (!this.listStates.find(x => x.state == e.state)) {
              this.listStates.push({ id: e.c_state, state: e.state });
            }
            if (!this.listCities.find(x => x.city == e.city)) {
              this.listCities.push({ id: e.c_cve_ciudad, city: e.city });
            }
            if (!this.listMunicipalities.find(x => x.municipality == e.municipality)) {
              this.listMunicipalities.push({ id: e.c_municipality, municipality: e.municipality });
            }
            if (!this.listSettlement.find(x => x.settlement == e.settlement)) {
              this.listSettlement.push({ id: e.c_settlement_type, settlement: e.settlement });
            }
          });
          this.errorMessages = '';
        }
      }
    })
  }
}
