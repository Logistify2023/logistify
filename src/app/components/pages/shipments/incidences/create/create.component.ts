import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { ShipmentsService } from 'src/app/services/shipments.service';


@Component({
  selector: 'app-incidences-create',
  templateUrl: './create.component.html',
  styleUrls: []
})
export class IncidencesCreateComponent {
  createForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;
  listIncidencesType: any[] = [];

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<IncidencesCreateComponent>,
    private formBuilder: FormBuilder,
    private apiShipments: ShipmentsService,
    private utils: Utils,
    public dialog: MatDialog) {
    this.createForm = formBuilder.group({
      incidence: new FormControl('', [Validators.required]),
      incidence_type_id: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });
  }
  ngOnInit(): void {
    this.apiShipments.getIncidencestypes(0, false, false, 'incidence_type').subscribe((e: any) => {
      this.listIncidencesType = e.data;
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
      incidence: form.get('incidence')?.value,
      incidence_type_id: form.get('incidence_type_id')?.value,
      description: form.get('description')?.value,
    };

    this.apiShipments.storeIncidences(data).subscribe(
      (e: any) => {
        this.submittedForm = false;
        if (e.result) {
          this.toastr.success(e.message, 'Incidencia', {
            timeOut: 3000,
            enableHtml: true
          });
          this.dialogRef.close();
        } else {
          this.toastr.error(e.message, 'Incidencia', {
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
