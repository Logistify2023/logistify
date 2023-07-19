import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-status-create',
  templateUrl: './create.component.html',
  styleUrls: []
})

export class AreasCreateComponent {
  createForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;
  listCollaborators: any[] = [];

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<AreasCreateComponent>,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private utils: Utils,
    public dialog: MatDialog) {
    this.createForm = formBuilder.group({
      area: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      is_responsable: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.api.getCollaborators(0, false, false, false, false).subscribe((e: any) => {
      this.listCollaborators = e.data;
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
      area: this.createForm.get('area')?.value,
      description: this.createForm.get('description')?.value,
      is_responsable: this.createForm.get('is_responsable')?.value,
    };
    this.api.storeUserArea(data).subscribe(
      (e: any) => {
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
      }, (error: any) => {
        let message = this.utils.getErrorMessage(error);
        this.errorMessages = message;
      }
    );
  }
}