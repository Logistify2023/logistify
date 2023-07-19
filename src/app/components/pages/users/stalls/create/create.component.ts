import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-stalls-create',
  templateUrl: './create.component.html',
  styleUrls: []
})

export class StallsCreateComponent {
  createForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;

  listPermissions: any[] = [];

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<StallsCreateComponent>,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private utils: Utils,
    public dialog: MatDialog
  ) {
    this.createForm = formBuilder.group({
      stall: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.api.getPermissions().subscribe((e: any) => {
      if (e.result) {
        this.listPermissions = e.data;
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
    let permissions: any = [];
    form.get('permissions')?.value.forEach((i: any) => {
      permissions.push(i);
    });
    const data = {
      stall: form.get('stall')?.value,
      description: form.get('description')?.value,
    };
    this.api.storeStall(data).subscribe(
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