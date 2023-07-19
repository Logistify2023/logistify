import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { ShipmentsService } from 'src/app/services/shipments.service';


@Component({
  selector: 'app-events-create',
  templateUrl: './create.component.html',
  styleUrls: []
})
export class EventsCreateComponent {
  createForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<EventsCreateComponent>,
    private formBuilder: FormBuilder,
    private apiShipments: ShipmentsService,
    private utils: Utils,
    public dialog: MatDialog) {
    this.createForm = formBuilder.group({
      key: new FormControl('', [Validators.required]),
      event: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });
  }


  onSubmit() {
    this.errorMessages = '';
    this.submittedForm = true;
    const form = this.createForm;

    if (form.invalid) {
      this.errorMessages = 'Verifica los datos.';
      return;
    }
    const data = {
      key: form.get('key')?.value,
      event: form.get('event')?.value,
      description: form.get('description')?.value,
    };

    this.apiShipments.storeEvents(data).subscribe(
      (e: any) => {
        this.submittedForm = false;
        if (e.result) {
          this.toastr.success(e.message, 'Evento', {
            timeOut: 3000,
            enableHtml: true
          });
          this.dialogRef.close();
        } else {
          this.toastr.error(e.message, 'Evento', {
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
