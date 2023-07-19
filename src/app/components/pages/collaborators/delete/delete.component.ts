import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { ApiService } from 'src/app/services/api.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-collaborators-delete',
  templateUrl: './delete.component.html'
})

export class CollaboratorsDeleteComponent implements OnInit {
  deleteForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;
  dataDeleted: boolean = false;

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<CollaboratorsDeleteComponent>,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private apiUser: UserService,
    private utils: Utils,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.deleteForm = this.formBuilder.group({
      id: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.dataDeleted = this.data.dataDeleted;
    this.deleteForm.setValue({
      id: this.data._id
    });
  }

  onSubmit() {
    this.errorMessages = '';
    if (this.deleteForm.invalid) {
      return;
    }
    this.apiUser.deleteUser(this.deleteForm.get('id')?.value, this.data.dataDeleted).subscribe(
      (e: any) => {
        this.submittedForm = false;
        if (e.result) {
          this.toastr.success(e.message, 'Eliminar', {
            timeOut: 3000,
            enableHtml: true
          });
          this.dialogRef.close();
        } else {
          this.toastr.error(e.message, 'Eliminar', {
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