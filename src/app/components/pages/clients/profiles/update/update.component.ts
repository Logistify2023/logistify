import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  templateUrl: './update.component.html'
})
export class ProfilesUpdateComponent implements OnInit {
  updateForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ProfilesUpdateComponent>,
    private formBuilder: FormBuilder,
    private apiCustomer: CustomerService,
    private utils: Utils,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.updateForm = this.formBuilder.group({
      id: new FormControl('', [Validators.required]),
      profile: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      // icon: new FormControl('', []),
      status: new FormControl('', []),
    });
  }

  ngOnInit(): void {
    this.apiCustomer.getClientsProfiles(this.data._id, false, false, this.data.dataDeleted).subscribe((e: any) => {
      if (e.result) {
        this.updateForm.setValue({
          id: e.data.id,
          profile: e.data.profile,
          description: e.data.description,
          // icon: e.data.icon,
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
      profile: form.get('profile')?.value,
      description: form.get('description')?.value,
      // icon: form.get('icon')?.value,
      status: (form.get('status')?.value) ? '1' : '0',
    };

    this.apiCustomer.updateClientProfile(data).subscribe(
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
