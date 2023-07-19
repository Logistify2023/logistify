import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { MessengerService } from 'src/app/services/messenger.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  templateUrl: './update.component.html'
})
export class MessengerUpdateComponent implements OnInit {
  updateForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;

  listCourierTypes: any[] = [];
  previewImagePath: string = "";

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<MessengerUpdateComponent>,
    private formBuilder: FormBuilder,
    private apiMessenger: MessengerService,
    private apiUtils: UtilsService,
    private utils: Utils,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.updateForm = formBuilder.group({
      id: new FormControl('', [Validators.required]), courier: new FormControl('', [Validators.required]),
      alias: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      link: new FormControl('', [Validators.required]),
      percentage: new FormControl('', [Validators.required]),
      has_api: new FormControl('', [Validators.required]),
      courier_types: new FormControl('', []),
      max_long: new FormControl('', [Validators.required]),
      max_width: new FormControl('', [Validators.required]),
      max_high: new FormControl('', [Validators.required]),
      max_weight: new FormControl('', [Validators.required]),
      volumetric_divider: new FormControl('', [Validators.required]),
      max_kilogram: new FormControl('', [Validators.required]),
      number_of_groups_origen: new FormControl('', [Validators.required]),
      number_of_groups_destine: new FormControl('', [Validators.required]),
      number_of_zones: new FormControl('', [Validators.required]),
      number_of_kilograms: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.apiMessenger.getCouriersTypes().subscribe((e: any) => {
      this.listCourierTypes = e.data;
    });
    this.apiMessenger.getCouriers(this.data._id, true, false, false, false, false, true, true, true, true, true, true, true, true, true, true, false,  true, true, true, this.data.dataDeleted).subscribe((e: any) => {
      if (e.result) {

        let courier_types: any[] = [];
        e.data.courier_types.forEach((i: any) => {
          courier_types.push(i.id);
        });
        // console.log(e.data)
        this.updateForm.setValue({
          id: e.data.id,
          courier: e.data.courier,
          alias: e.data.alias,
          description: e.data.description,
          email: e.data.email,
          phone: e.data.phone,
          link: e.data.link,
          percentage: e.data.percentage,
          has_api: e.data.has_api,
          courier_types: courier_types,
          max_long: (e.data.setting) ? e.data.setting.max_long : '',
          max_width: (e.data.setting) ? e.data.setting.max_width : '',
          max_high: (e.data.setting) ? e.data.setting.max_high : '',
          max_weight: (e.data.setting) ? e.data.setting.max_weight : '',
          volumetric_divider: (e.data.setting) ? e.data.setting.volumetric_divider : '',
          max_kilogram: (e.data.setting) ? e.data.setting.max_kilogram : '',
          number_of_groups_origen: (e.data.setting) ? e.data.setting.number_of_groups_origen : '',
          number_of_groups_destine: (e.data.setting) ? e.data.setting.number_of_groups_destine : '',
          number_of_zones: (e.data.setting) ? e.data.setting.number_of_zones : '',
          number_of_kilograms: (e.data.setting) ? e.data.setting.number_of_kilograms : '',
          // image: u_image,
          status: (e.data.status == 'DISPONIBLE') ? true : false,
          // setting_id
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
  }

  filedata: any;
  fileEvent(e: any) {
    if (e.target.files.length > 0) {
      const file: File = e.target.files[0];
      this.filedata = file;
    }
  }

  // onFileChange(event: any) {
  //   const file = (event.target as HTMLInputElement).files![0];
  //   const reader = new FileReader();
  //   if (file) {
  //     reader.readAsDataURL(file);
  //   }
  //   reader.onload = () => {
  //     this.previewImagePath = reader.result as string;
  //   };
  //   if (event.target.files.length > 0) {
  //     const file = event.target.files[0];
  //     this.filedata = file;
  //     this.updateForm.patchValue({
  //       image: this.filedata,
  //     });
  //   }
  // }
  onSubmit() {
    this.errorMessages = '';
    const form = this.updateForm;
    this.submittedForm = true;

    if (form.invalid) {
      this.errorMessages = 'Verifica los datos.';
      return;
    }

    var formData: any = new FormData();
    form.get('courier_types')?.value.forEach((i: any) => {
      formData.append("courier_types[]", i);
    });
    formData.append("id", form.get('id')?.value);
    formData.append("courier", form.get('courier')?.value);
    formData.append("alias", form.get('alias')?.value);
    formData.append("description", form.get('description')?.value);
    formData.append("email", form.get('email')?.value);
    formData.append("phone", form.get('phone')?.value.toString());
    formData.append("link", form.get('link')?.value);
    formData.append("percentage", form.get('percentage')?.value.toString());
    formData.append("has_api", (form.get('has_api')?.value) ? '1' : '0');
    formData.append("max_long", form.get('max_long')?.value.toString());
    formData.append("max_width", form.get('max_width')?.value.toString());
    formData.append("max_high", form.get('max_high')?.value.toString());
    formData.append("max_weight", form.get('max_weight')?.value.toString());
    formData.append("volumetric_divider", form.get('volumetric_divider')?.value.toString());
    formData.append("max_kilogram", form.get('max_kilogram')?.value.toString());
    formData.append("number_of_groups_origen", form.get('number_of_groups_origen')?.value.toString());
    formData.append("number_of_groups_destine", form.get('number_of_groups_destine')?.value.toString());
    formData.append("number_of_zones", form.get('number_of_zones')?.value.toString());
    formData.append("number_of_kilograms", form.get('number_of_kilograms')?.value.toString());
    formData.append("status", (form.get('status')?.value) ? '1' : '0');
    formData.append("_method", 'PUT');

    this.apiMessenger.updateCouriers(form.get('id')?.value, formData).subscribe(
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
