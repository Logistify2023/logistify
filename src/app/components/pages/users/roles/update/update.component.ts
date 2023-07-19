import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { ApiService } from 'src/app/services/api.service';
import { ShipmentsService } from 'src/app/services/shipments.service';

@Component({
  selector: 'app-roles-update',
  templateUrl: './update.component.html'
})

export class RolesUpdateComponent implements OnInit {
  updateForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;
  hiddenPermissionsRole: boolean = false;

  listPermissions: any[] = [];
  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<RolesUpdateComponent>,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private utils: Utils,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.updateForm = formBuilder.group({
      id: new FormControl('', [Validators.required]),
      rol: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      full_access: new FormControl('', []),
      to_assign_customers: new FormControl('', []),
      is_user: new FormControl('', []),
      can_delete: new FormControl('', []),
      permissions: new FormControl('', []),
      status: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.api.getRolById(this.data._id, true, false, false, this.data.dataDeleted).subscribe((e: any) => {
      if (e.result) {
        let permissions: any[] = [];
        e.data.permissions.forEach((i: any) => {
          permissions.push(i.id);
        });
        if(e.data.full_access == 'YES'){
          this.hiddenPermissionsRole = true;
        }
        this.updateForm.setValue({
          id: e.data.id,
          rol: e.data.rol,
          description: e.data.description,
          full_access: (e.data.full_access == 'YES') ? true : false,
          to_assign_customers: (e.data.to_assign_customers == 'YES') ? true : false,
          is_user: e.data.is_user,
          can_delete: e.data.can_delete,
          permissions: permissions,
          status: (e.data.status == 'DISPONIBLE') ? true : false
        });
      } else {
        this.toastr.error(e.message, 'Error', {
          timeOut: 3000,
          enableHtml: true
        });
      }
    });
    this.api.getPermissions().subscribe((e: any) => {
      if (e.result) {
        this.listPermissions = e.data;
      }
    });
  }

  changeUpdateFullAccess(){
    let full_access_value = this.updateForm.get('full_access')?.value;
    console.log(full_access_value);
    if(full_access_value == true){
      this.hiddenPermissionsRole = true;
    }else{
      this.hiddenPermissionsRole = false;
    }
  }

  onSubmit() {
    this.errorMessages = '';
    const form = this.updateForm;
    this.submittedForm = true;
    if (form.invalid) {
      this.errorMessages = 'Verifica los datos.';
      return;
    }
    let permissions: any = [];
    form.get('permissions')?.value.forEach((i: any) => {
      permissions.push(i);
    });
    const data = {
      id: form.get('id')?.value,
      rol: form.get('rol')?.value,
      description: form.get('description')?.value,
      full_access: (form.get('full_access')?.value) ? 'YES' : 'NO',
      to_assign_customers: (form.get('to_assign_customers')?.value) ? 'YES' : 'NO',
      is_user: form.get('is_user')?.value,
      can_delete: form.get('can_delete')?.value,
      permissions: permissions,
      status: (form.get('status')?.value) ? '1' : '0',
    };
    this.api.updateRol(data).subscribe(
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