import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { ShipmentsService } from 'src/app/services/shipments.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-receivers-update',
  templateUrl: './update.component.html'
})
export class ReceiversUpdateComponent implements OnInit {
  updateForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;
  listSettlement: any[] = [];
  listStates: any[] = [];
  listCities: any[] = [];
  listMunicipalities: any[] = [];

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ReceiversUpdateComponent>,
    private formBuilder: FormBuilder,
    private apiShipments: ShipmentsService,
    private apiUtils: UtilsService,
    private utils: Utils,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.updateForm = formBuilder.group({
      id: new FormControl('', [Validators.required]),
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
      id_postal_code: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.apiShipments.getReceivers(this.data._id, false, true, this.data.dataDeleted).subscribe((e: any) => {
      if (e.result) {
        if (e.data.addressables) {
        }
        this.updateForm.setValue({
          id: e.data.id,
          business_name: e.data.business_name,
          name: e.data.name,
          surname: e.data.surname,
          lastname: e.data.lastname,
          phone: e.data.phone,
          email: e.data.email,
          street: (e.data.addressables) ? e.data.addressables[0].street : '',
          suburb: (e.data.addressables) ? e.data.addressables[0].suburb : '',
          location: (e.data.addressables) ? e.data.addressables[0].location : '',
          outdoor_number: (e.data.addressables) ? e.data.addressables[0].outdoor_number : '',
          interior_number: (e.data.addressables) ? e.data.addressables[0].interior_number : '',
          postal_code: (e.data.addressables) ? (e.data.addressables[0].address) ? e.data.addressables[0].address.postal_code : '' : '',
          id_postal_code: (e.data.addressables) ? (e.data.addressables[0].address) ? e.data.addressables[0].address.id : '' : '',
          status: (e.data.status == 'DISPONIBLE') ? true : false,
        });
        this.validateCPUpdate();
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
      id_postal_code: this.listSettlement.find(x => x.settlement == this.updateForm.get('suburb')?.value).id,
      status: (form.get('status')?.value) ? '1' : '0',
    };

    this.apiShipments.updateReceivers(data).subscribe(
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
  validateCPUpdate() {
    console.log('validateCPUpdate');
    this.apiUtils.getAddressByPostalCode(this.updateForm.get('postal_code')?.value).subscribe((e: any) => {
      console.log(e);
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
            console.log(this.listSettlement);
          });
          this.errorMessages = '';
        }
      }
    })
  }
}
