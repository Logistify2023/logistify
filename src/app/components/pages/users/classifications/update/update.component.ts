import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { ApiService } from 'src/app/services/api.service';

@Component({
  templateUrl: './update.component.html'
})

export class ClassificationsUpdateComponent implements OnInit {
  updateForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;

  listPermissions: any[] = [];
  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ClassificationsUpdateComponent>,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private utils: Utils,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.updateForm = formBuilder.group({
      id: new FormControl('', [Validators.required]),
      classification: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      permissions: new FormControl('', []),
      status: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.api.getClassificationById(this.data._id, true, false).subscribe((e: any) => {
      if (e.result) {
        let permissions: any[] = [];
        e.data.permissions.forEach((i: any) => {
          permissions.push({
            id: i.id,
            permission: i.permission
          });
        });

        this.updateForm.setValue({
          id: e.data.id,
          classification: e.data.classification,
          description: e.data.description,
          status: (e.data.status == 'DISPONIBLE')? true: false,
          permissions: permissions
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
    this.api.getPermissions().subscribe((e: any) => {
      if (e.result) {
        this.listPermissions = e.data;
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
      classification: form.get('classification')?.value,
      description: form.get('description')?.value,
      status: (form.get('status')?.value) ? '1' : '0',
      permissions: form.get('permissions')?.value,
    };
    this.api.updateClassification(data).subscribe(
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