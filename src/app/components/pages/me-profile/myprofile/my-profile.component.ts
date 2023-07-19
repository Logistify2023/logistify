import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MeProfileService } from 'src/app/services/meProfile.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MyProfileUpdateComponent } from './update/my-profile-update.component';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: []
})

// Exportamos el componente
export class MyProfileComponent implements OnInit {
  
  // Definimos las variables a utilizar
  userInfo:   any = {};
  infoImage:  any;
  updateForm:         FormGroup;
  updatePasswordForm: FormGroup;
  formAvatar:         FormGroup;
  modalUpdate:        any;
  submittedForm:      boolean = false;
  uploadFile:         boolean = false;
  errorMessages:      string = '';
  objectDetails:      any = {};
  image:              any = '';

  // Definimos los servicios a utilizar en este componente
  constructor(
    private formBuilder: FormBuilder,
    private meProfile: MeProfileService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {
      // Form para los datos usuario
    this.updateForm = formBuilder.group({
      // Data user
      name: new FormControl('', [Validators.required]),
      lastname: new FormControl('', []),
      surname: new FormControl('', []),
      username: new FormControl('', []),
      slug: new FormControl('', []),
      email: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required, Validators.email]),
      is_webservices: new FormControl('', [Validators.required, Validators.minLength(10)]),
      status: new FormControl('', [Validators.required]),
      // Data account
      description: new FormControl('', [Validators.required]),
      birth_date: new FormControl('', []),
      home_phone: new FormControl('', []),
      link: new FormControl('', []),
      website: new FormControl('', []),
      facebook: new FormControl('', []),
      youtube: new FormControl('', []),
      instagram: new FormControl('', []),
      twiter: new FormControl('', []),
      linkendin: new FormControl('', []),
      sex: new FormControl('', []),
      // Data relation
      stall: new FormControl('', []),
      account: new FormControl('', []),
      areas: new FormControl('', []),
      roles: new FormControl('', []),
      // Data relation Id's
      area_id: new FormControl('', []),
      stall_id: new FormControl('', []),
      role_id: new FormControl('', []),
      permissions: new FormControl('', []),
      clients: new FormControl('', []),
    });
    // Form para cambiar password
    this.updatePasswordForm = formBuilder.group({
      password: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required]),
      newPassword_confirmation: new FormControl('', [Validators.required]),
    });
    // Form para actualizar imagen
    this.formAvatar = this.formBuilder.group({
      image: new FormControl('', []),
    });
  }

  // Incia el componente
  ngOnInit(): void {
    this.loadProfileData();
  }

  // Carga data del usuarios
  loadProfileData() {
    this.submittedForm = true;
    this.image = localStorage.getItem('avatar');
    this.meProfile.getMeProfile().subscribe((e: any) => {
      this.submittedForm = false;
      if (e.result) {
        this.userInfo = e.data;
        this.updateForm.setValue({
          // Data user
          name: this.userInfo.name,
          lastname: this.userInfo.lastname,
          surname: this.userInfo.surname,
          username: this.userInfo.username,
          slug: this.userInfo.slug,
          email: this.userInfo.email,
          phone: this.userInfo.phone,
          is_webservices: this.userInfo.is_webservices,
          status: this.userInfo.status,
          // Data for account
          description: this.userInfo.account?.description,
          birth_date: this.userInfo.account?.birth_date,
          home_phone: this.userInfo.account?.home_phone,
          link: this.userInfo.account?.link,
          website: this.userInfo.account?.website,
          facebook: this.userInfo.account?.facebook,
          youtube: this.userInfo.account?.youtube,
          instagram: this.userInfo.account?.instagram,
          twiter: this.userInfo.account?.twiter,
          linkendin: this.userInfo.account?.linkendin,
          sex: this.userInfo.account?.sex,
          // Data relation
          stall: this.userInfo?.stall,
          account: this.userInfo?.account,
          areas: this.userInfo?.areas,
          roles: this.userInfo?.roles,
          // Data relation ID's
          area_id: (this.userInfo?.areas.length > 0) ? this.userInfo?.areas[0].id : '',
          stall_id: (this.userInfo?.stall) ? this.userInfo?.stall.id : '',
          role_id: (this.userInfo?.roles.length > 0) ? this.userInfo?.roles[0].id : '',
          permissions: (this.userInfo?.permissions.length > 0) ? this.userInfo?.permissions : [],
          clients: (this.userInfo?.customers.length > 0) ? this.userInfo?.customers : '',
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

  /* UPDATE */
  openModalUpdate(id: number) {
    const dialogRef = this.dialog.open(MyProfileUpdateComponent, {
      width: '80vw',
      data: { _id: id },
      disableClose: true
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.loadProfileData();
      }
    });
  }
  
  // Almacena la información del archivo a importar
  fileData: any;
  // Permite validar el archivo que se subira sea excel
  changeImage(event: any) {
    const file = (event.target as HTMLInputElement).files![0];
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
    }
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileData = file;
      this.formAvatar.patchValue({
        image: this.fileData,
      });
      this.uploadFile = true;
    }
  }

  // Se encarga de actualizar la información del usuario
  updateAvatar(id: number) {
    var formData: any = new FormData();
    formData.append("image", this.fileData);
    this.uploadFile = false;
    // Enviamos la data al servicio
    this.meProfile.updateMeImage(formData).subscribe(
      (e: any) => {
        if (e.result) {
          // Asignamos la imagen al localstorage
          if (localStorage.getItem('avatar')) {
            localStorage.setItem('avatar', e.data);
            // Refrescamos la imagen cargada
            this.image = e.data;
            // Mostramos la notificación de exito
            this.toastr.success(e.message, 'Actualizada', {
              timeOut: 3000,
              enableHtml: true
            });
            // Recargamos la pagina
            this.reloadPage();
          }
        } else {
          this.toastr.warning(e.message, 'Advertencia', {
            timeOut: 3000,
            enableHtml: true
          });
        }
      },
      (error) => {
        this.toastr.error("No se logro cambiar su avatar", 'Error', {
          timeOut: 3000,
          enableHtml: true
        });
      }
    );
  }

  // Función que se encaga de recargar la página
  reloadPage(): void {
    window.location.reload();
  }
}