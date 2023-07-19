import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { CustomerService } from 'src/app/services/customer.service';
import { MessengerService } from 'src/app/services/messenger.service';
import { GlobalConstants } from "../../../../../common/global-constants";

@Component({
  templateUrl: './update.component.html'
})
export class ProfilesServicesUpdateComponent implements OnInit {
  urlEndPoint: String = GlobalConstants.apiURL;

  updateForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;
  fileRequired = false;
  idService: number;

  listTypePrices: any[] = [];
  listProfiles: any[] = [];
  listServices: any[] = [];

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ProfilesServicesUpdateComponent>,
    private formBuilder: FormBuilder,
    private apiMessenger: MessengerService,
    private apiCustomer: CustomerService,
    private utils: Utils,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.updateForm = formBuilder.group({
      id: new FormControl('', [Validators.required]),
      profile: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.apiMessenger.getTypePrices(0, false, false).subscribe((e: any) => {
      this.listTypePrices = e.data;
    });
    this.apiCustomer.getClientsProfiles().subscribe((e: any) => {
      if (e.result) {
        this.listProfiles = e.data;
      }
    });
    this.apiMessenger.getServices(0).subscribe((e: any) => {
      this.listServices = e.data;
    });

    this.apiMessenger.getProfilesServices(this.data._id, false, true, true, true, this.data.dataDeleted).subscribe((e: any) => {
      if (e.result) {
        // console.log(e.data)
        let services = e.data.profile_services;

        services.forEach((i: any) => {
          console.log(i)
          services.push(i.service_id);
        });
        this.updateForm.setValue({
          id: e.data.id,
          profile: e.data.profile,
          description: e.data.description,
          status: (e.data.status == 'DISPONIBLE') ? true : false,
          // setting_id
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

  changeServiceUpdate(){
    let id_servicio = this.updateForm.get('service_id')?.value;
    this.idService = id_servicio;
  }



  onSubmit() {
    this.errorMessages = '';
    const form = this.updateForm;
    this.submittedForm = true;

    if (form.invalid) {
      this.errorMessages = 'Verifica los datos.';
      return;
    }
    
    var formData: any = new FormData();
    formData.append("profile", form.get('profile')?.value);
    formData.append("description", form.get('description')?.value);
    formData.append("status", (form.get('status')?.value) ? '1' : '0');
    formData.append("_method", 'PUT');

    this.apiMessenger.updateProfilesServices(form.get('id')?.value, formData).subscribe(
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
