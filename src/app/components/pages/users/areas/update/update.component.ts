import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { ApiService } from 'src/app/services/api.service';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-status-update',
  templateUrl: './update.component.html'
})

export class AreasUpdateComponent implements OnInit {
  updateForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;
  listCollaborators: any[] = [];

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<AreasUpdateComponent>,
    private formBuilder: FormBuilder,
    private apiCustomer: CustomerService,
    private api: ApiService,
    private utils: Utils,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.updateForm = formBuilder.group({
      id: new FormControl('', [Validators.required]),
      area: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      is_responsable: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.apiCustomer.getAreasByID(this.data._id, false, true, false, this.data.dataDeleted).subscribe((e: any) => {
      if (e.result) {
        this.updateForm.setValue({
          id: e.data.id,
          area: e.data.area,
          description: e.data.description,
          is_responsable: (e.data.responsable[0]?.id) ? e.data.responsable[0]?.id : 0,
          status: (e.data.status == 'DISPONIBLE') ? true : false
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
    this.api.getCollaborators(0, false, false, false, false).subscribe((e: any) => {
      this.listCollaborators = e.data;
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
      area: form.get('area')?.value,
      description: form.get('description')?.value,
      is_responsable: form.get('is_responsable')?.value,
      status: (form.get('status')?.value) ? '1' : '0',
    };
    this.api.updateUserArea(data).subscribe(
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
      }, (error: any) => {
        let message = this.utils.getErrorMessage(error);
        this.errorMessages = message;
      }
    );
  }
}