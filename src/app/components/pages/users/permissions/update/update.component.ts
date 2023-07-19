import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-permissions-update',
  templateUrl: './update.component.html'
})

export class PermissionsUpdateComponent implements OnInit {
  updateForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;

  listClassification: any[] = [];
  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<PermissionsUpdateComponent>,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private utils: Utils,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.updateForm = formBuilder.group({
      id: new FormControl('', [Validators.required]),
      permission: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      classification_id: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.api.getPermissions(this.data._id, true, true, true, this.data.dataDeleted).subscribe((e: any) => {
      if (e.result) {
        this.updateForm.setValue({
          id: e.data.id,
          permission: e.data.permission,
          description: e.data.description,
          classification_id: e.data.classification_id,
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
    this.api.getClassifications().subscribe((e: any) => {
      if (e.result) {
        this.listClassification = e.data;
      }
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
      permission: form.get('permission')?.value,
      description: form.get('description')?.value,
      classification_id: form.get('classification_id')?.value,
      status: (form.get('status')?.value) ? '1' : '0',
    };
    this.api.updatePermission(data).subscribe(
      (e: any) => {
        this.submittedForm = false;
        if (e.result) {
          this.toastr.success(e.message, 'Actualización', {
            timeOut: 3000,
            enableHtml: true,
          });
          this.dialogRef.close();
        } else {
          this.toastr.error(e.message, 'Actualización', {
            timeOut: 3000,
            enableHtml: true,
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