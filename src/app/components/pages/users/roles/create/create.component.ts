import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { ApiService } from 'src/app/services/api.service';
import { ShipmentsService } from 'src/app/services/shipments.service';

@Component({
  selector: 'app-roles-create',
  templateUrl: './create.component.html',
  styleUrls: []
})

export class RolesCreateComponent {
  createForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;
  hiddenPermissionsRole: boolean = false;

  listPermissions: any[] = [];

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<RolesCreateComponent>,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private utils: Utils,
    public dialog: MatDialog
  ) {
    this.createForm = formBuilder.group({
      rol: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      full_access: new FormControl('', [Validators.nullValidator]),
      to_assign_customers: new FormControl('', []),
      is_user: new FormControl('', []),
      can_delete: new FormControl('', []),
      permissions: new FormControl('', [Validators.nullValidator]),
    });
  }

  ngOnInit(): void {
    this.api.getPermissions().subscribe((e: any) => {
      if (e.result) {
        this.listPermissions = e.data;
      }
    });
  }

  changeCreateFullAccess(){
    let full_access_value = this.createForm.get('full_access')?.value;
    if(full_access_value == true){
      this.hiddenPermissionsRole = true;
    }else{
      this.hiddenPermissionsRole = false;
    }
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
    if (form.get('permissions')?.value) {
      form.get('permissions')?.value.forEach((i: any) => {
        permissions.push(i);
      });
    }
    
    const data = {
      rol: form.get('rol')?.value,
      description: form.get('description')?.value,
      full_access: (form.get('full_access')?.value) ? 'YES' : 'NO',
      to_assign_customers: (form.get('to_assign_customers')?.value) ? 'YES' : 'NO',
      is_user: (form.get('is_user')?.value) ? true : false,
      can_delete: (form.get('can_delete')?.value) ? true : false,
      permissions: permissions,
    };
  
    this.api.storeRol(data).subscribe(
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