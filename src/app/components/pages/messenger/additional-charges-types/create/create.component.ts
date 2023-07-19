import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { MessengerService } from 'src/app/services/messenger.service';

@Component({
  templateUrl: './create.component.html',
  styleUrls: []
})

export class AdditionalChargesTypesCreateComponent {
  createForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;
  listAdditionalChargeTypes: any[] = [];

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<AdditionalChargesTypesCreateComponent>,
    private formBuilder: FormBuilder,
    private apiMessenger: MessengerService,
    private utils: Utils,
    public dialog: MatDialog
  ) {
    this.createForm = formBuilder.group({
      charge_type: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.apiMessenger.getAdditionalChargeTypes(0, false, false, 'charge_type').subscribe((e: any) => {
      this.listAdditionalChargeTypes = e.data;
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
      charge_type: form.get('charge_type')?.value,
      description: form.get('description')?.value,
    };
    this.apiMessenger.storeAdditionalChargeTypes(data).subscribe(
      (e: any) => {
        this.submittedForm = false;
        if (e.result) {
          this.toastr.success(e.message, 'Grupo de cargo adicional', {
            timeOut: 3000,
            enableHtml: true
          });
          this.dialogRef.close();
        } else {
          this.toastr.error(e.message, 'Grupo de cargo adicional', {
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