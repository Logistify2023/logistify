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
export class CourierTypesCreateComponent {
  createForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<CourierTypesCreateComponent>,
    private formBuilder: FormBuilder,
    private apiMessenger: MessengerService,
    private utils: Utils,
    public dialog: MatDialog) {
    this.createForm = formBuilder.group({
      courier_type: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
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
      courier_type: form.get('courier_type')?.value,
      description: form.get('description')?.value,
    };

    this.apiMessenger.storeCouriersTypes(data).subscribe(
      (e: any) => {
        this.submittedForm = false;
        if (e.result) {
          this.toastr.success(e.message, 'Tipos de mensajería', {
            timeOut: 3000,
            enableHtml: true
          });
          this.dialogRef.close();
        } else {
          this.toastr.error(e.message, 'Tipos de mensajería', {
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
