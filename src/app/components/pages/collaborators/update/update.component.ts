import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { ApiService } from 'src/app/services/api.service';
import { CustomerService } from 'src/app/services/customer.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-collaborators-update',
  templateUrl: './update.component.html'
})

export class CollaboratorsUpdateComponent implements OnInit {

  updateFormGroup: FormGroup;
  listRoles: any[] = [];
  listStalls: any[] = [];
  listAreas: any[] = [];
  listPermissions: any[] = [];
  isEditable = false;
  errorMessages: string = '';
  submittedForm: boolean = false;
  previewImagePath: string = '';
  filedata: any;

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<CollaboratorsUpdateComponent>,
    private formBuilder: FormBuilder,
    private apiUser: UserService,
    private apiCustomer: CustomerService,
    private api: ApiService,
    private utils: Utils,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.updateFormGroup = this.formBuilder.group({
      id: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      surname: new FormControl('', [Validators.nullValidator]),
      lastname: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.minLength(10),]),
      area_id: new FormControl('', []),
      stall_id: new FormControl('', []),
      role_id: new FormControl('', []),
      permissions: new FormControl([Validators.nullValidator]),
    });
  } 

  ngOnInit(): void {
    this.api.getUserById(this.data._id, true, false, true, false, true, true, false, false, false, false).subscribe((e: any) => {
        if (e.result) {
          let selectedPermissions: any[] = [];
          if(e.data.permissions) {
            e.data.permissions.forEach((i: any) => {
              selectedPermissions.push(i.id)
            });
          }
          this.updateFormGroup.setValue({
            id: e.data.id,
            name: e.data.name,
            lastname: e.data.lastname,
            username: e.data.username,
            surname: e.data.surname,
            email: e.data.email,
            phone: e.data.phone,
            status: (e.data.status == 'DISPONIBLE') ? true : false,
            area_id: e.data.areas.length > 0 ? e.data.areas[0].id : '',
            stall_id: (e.data.stall) ? e.data.stall.id : '',
            role_id: e.data.roles.length > 0 ? e.data.roles[0].id : '',
            permissions: selectedPermissions,
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
    this.apiCustomer.getAreas().subscribe((e: any) => {
      if (e.result) {
        this.listAreas = e.data;
      }
    });
    this.api.getRoles(true, true).subscribe((e: any) => {
      if (e.result) {
        this.listRoles = e.data;
      }
    });
    this.api.getStalls().subscribe((e: any) => {
      if (e.result) {
        this.listStalls = e.data;
      }
    });
  }

  onSubmit() {
    this.errorMessages = '';
    this.submittedForm = true;
    let newPermissions: any[] = [];
    this.updateFormGroup.get('permissions')?.value!.forEach((i: any) => {
      newPermissions.push(i);
    });
    const data = {
      id: this.updateFormGroup.get('id')?.value,
      name: this.updateFormGroup.get('name')?.value,
      surname: this.updateFormGroup.get('surname')?.value,
      lastname: this.updateFormGroup.get('lastname')?.value,
      username: this.updateFormGroup.get('username')?.value,
      email: this.updateFormGroup.get('email')?.value,
      phone: (this.updateFormGroup.get('phone')?.value).toString(),
      area_id: this.updateFormGroup.get('area_id')?.value,
      stall_id: this.updateFormGroup.get('stall_id')?.value,
      role_id: this.updateFormGroup.get('role_id')?.value,
      permissions: newPermissions,
      status: (this.updateFormGroup.get('status')?.value) ? '1' : '0',
    }
    this.apiUser.updateUser(data, this.data._id).subscribe(
      (e: any) => {
        this.submittedForm = false;
        if (e.result) {
          this.toastr.success(e.message, 'Actualizar', {
            timeOut: 3000,
            enableHtml: true,
          });
          this.dialogRef.close();
        } else {
          this.toastr.error(e.message, 'Actualizar', {
            timeOut: 3000,
            enableHtml: true,
          });
        }
      },
      (error: any) => {
        let message = this.utils.getErrorMessage(error);
        this.errorMessages = message;
      }
    );
  }
}