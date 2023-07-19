import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { MessengerService } from 'src/app/services/messenger.service';

@Component({
  templateUrl: './create.component.html',
  styleUrls: []
})

export class MessengerCreateComponent {
  createForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;

  listCourierTypes: any[] = [];
  previewImagePath: string = "";

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<MessengerCreateComponent>,
    private formBuilder: FormBuilder,
    private apiMessenger: MessengerService,
    private utils: Utils,
    public dialog: MatDialog
  ) {
    this.createForm = formBuilder.group({
      courier: new FormControl('', [Validators.required]),
      alias: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      link: new FormControl('', [Validators.required]),
      percentage: new FormControl('', [Validators.required]),
      image: new FormControl('', [Validators.required]),
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
    });
  }

  ngOnInit(): void {
    this.apiMessenger.getCouriersTypes().subscribe((e: any) => {
      this.listCourierTypes = e.data;
    });
  }

  filedata: any;
  fileEvent(e: any) {
    if (e.target.files.length > 0) {
      const file: File = e.target.files[0];
      this.filedata = file;
    }
  }

  onFileChange(event: any) {
    const file = (event.target as HTMLInputElement).files![0];
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
    }
    reader.onload = () => {
      this.previewImagePath = reader.result as string;
    };
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.filedata = file;
      this.createForm.patchValue({
        image: this.filedata,
      });
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
    var formData: any = new FormData();
    form.get('courier_types')?.value.forEach((i: any) => {
      formData.append("courier_types[]", i);
    });
    formData.append("image", this.filedata);
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
    this.apiMessenger.storeCouriers(formData).subscribe(
      (e: any) => {
        this.submittedForm = false;
        if (e.result) {
          this.toastr.success(e.message, 'Mensajería', {
            timeOut: 3000,
            enableHtml: true
          });
          this.dialogRef.close();
        } else {
          this.toastr.error(e.message, 'Mensajería', {
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