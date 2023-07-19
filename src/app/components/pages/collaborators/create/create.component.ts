import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { ApiService } from 'src/app/services/api.service';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-collaborators-create',
  templateUrl: './create.component.html',
  styleUrls: []
})

export class CollaboratorsCreateComponent {
  firstFormGroup = this.formBuilder.group({
    name: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.nullValidator]),
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(15)]),
  });
  secondFormGroup = this.formBuilder.group({
    birth_date: ['', Validators.required],
    sex: ['', Validators.required],
    image: ['', Validators.nullValidator],
    area_id: ['', Validators.required],
    stall_id: ['', Validators.required],
    role_id: ['', Validators.required],
  });
  thirdFormGroup = this.formBuilder.group({
    description: ['', Validators.nullValidator],
    permissions: new FormControl([]),
  });
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
    public dialogRef: MatDialogRef<CollaboratorsCreateComponent>,
    private formBuilder: FormBuilder,
    private utils: Utils,
    public dialog: MatDialog, private api: ApiService, private apiCustomer: CustomerService
  ) { }

  ngOnInit(): void {
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

  onFileChange(event: any) {
    const file = (event.target as HTMLInputElement).files![0];
    const reader = new FileReader();
    reader.onload = () => {
      this.previewImagePath = reader.result as string;
    };
    if (file) {
      reader.readAsDataURL(file);
    }
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.filedata = file;
      this.secondFormGroup.patchValue({
        image: this.filedata,
      });
    }
  }

  onSubmit() {
    this.errorMessages = '';
    this.submittedForm = true;
    const formData = new FormData();

    this.thirdFormGroup.get('permissions')?.value!.forEach((i: any) => {
      formData.append("permissions[]", i);
    });

    formData.append('name', this.firstFormGroup.get('name')?.value!);
    formData.append('lastname', this.firstFormGroup.get('lastname')?.value!);
    formData.append('surname', this.firstFormGroup.get('surname')?.value!);
    formData.append('username', this.firstFormGroup.get('username')?.value!);
    formData.append('email', this.firstFormGroup.get('email')?.value!);
    formData.append('phone', (this.firstFormGroup.get('phone')?.value!).toString());
    formData.append('description', this.thirdFormGroup.get('description')?.value!);
    formData.append('birth_date', this.secondFormGroup.get('birth_date')?.value!);
    formData.append('sex', this.secondFormGroup.get('sex')?.value!);
    formData.append('area_id', this.secondFormGroup.get('area_id')?.value!);
    formData.append('stall_id', this.secondFormGroup.get('stall_id')?.value!);
    formData.append('role_id', this.secondFormGroup.get('role_id')?.value!);
    formData.append("image", this.filedata);
    this.api.putUser(formData).subscribe(
      (e: any) => {
        if (e.result) {
          this.toastr.success(e.message, 'Colaboradores', {
            timeOut: 3000,
            enableHtml: true
          });
          this.dialogRef.close();
        } else {
          this.toastr.error(e.message, 'Colaboradores', {
            timeOut: 3000,
            enableHtml: true
          });
        }
      },
      (error) => {
        let message = this.utils.getErrorMessage(error);
        this.errorMessages = message;
      });
  }
}
