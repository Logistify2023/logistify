import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { ShipmentsService } from 'src/app/services/shipments.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-collaborators-restore',
  templateUrl: './restore.component.html'
})

export class CollaboratorsRestoreComponent implements OnInit {
  form: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<CollaboratorsRestoreComponent>,
    private formBuilder: FormBuilder,
    private apiUser: UserService,
    private utils: Utils,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = formBuilder.group({
      id: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.form.setValue({
      id: this.data._id
    });
  }

  onSubmit() {
    this.errorMessages = '';
    if (this.form.invalid) {
      return;
    }
    this.apiUser.restoreUser(this.form.get('id')?.value).subscribe(
      (e: any) => {
        this.submittedForm = false;
        if (e.result) {
          this.toastr.success(e.message, 'Restaurar', {
            timeOut: 3000,
            enableHtml: true
          });
          this.dialogRef.close();
        } else {
          this.toastr.error(e.message, 'Restaurar', {
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