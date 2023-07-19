import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-permissions-create',
  templateUrl: './create.component.html',
  styleUrls: []
})

export class PermissionsCreateComponent {
  createForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;

  listClassification: any[] = [];
  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<PermissionsCreateComponent>,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private utils: Utils,
    public dialog: MatDialog
  ) {
    this.createForm = formBuilder.group({
      permission: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      classification_id: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.api.getClassifications().subscribe((e: any) => {
      if (e.result) {
        this.listClassification = e.data;
      }
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
      permission: form.get('permission')?.value,
      description: form.get('description')?.value,
      classification_id: form.get('classification_id')?.value,
      can_delete: true
    };

    this.api.storePermission(data).subscribe(
      (e: any) => {
        this.submittedForm = false;
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
      },
      (error) => {
        let message = this.utils.getErrorMessage(error);
        this.errorMessages = message;
      }
    );
  }
}