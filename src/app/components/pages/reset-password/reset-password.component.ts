import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: []
})

export class ResetPasswordComponent implements OnInit {

  restoreForm : FormGroup;
  submitted   : boolean = false;
  token       : string  = '';

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
  ) {
    this.restoreForm = formBuilder.group({
      password: new FormControl('', [Validators.required]),
      password_confirmation: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    const _token = this.route.snapshot.paramMap.get("token");
    if (_token) {
      this.token = _token;
      // Falta validar el token si es correcto
      /* this.api.validatePasswordToken(_token).subscribe((e: any) => {
        if (e.result) {
          this.token = e.data;
        }
      }); */
    } else {
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    }
  }

  onSubmit() {
    if (this.restoreForm.get('password')?.value != this.restoreForm.get('password_confirmation')?.value) {
      this.toastr.warning('Las contraseñas deben ser iguales, verifica tus datos', 'Datos incorrectos', {
        timeOut: 3000,
        enableHtml: true
      });
      return;
    }
    const data = {
      password: this.restoreForm.get('password')?.value,
      password_confirmation: this.restoreForm.get('password_confirmation')?.value
    }
    this.submitted = true;
    this.api.changePassword(data, this.token).subscribe((e: any) => {
      if (e.result) {
        this.toastr.success('Contraseña restablecida correctamente, inicia sesión con tu nueva contraseña', 'Contraseña restablecida', {
          timeOut: 3000,
          enableHtml: true
        });
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        this.toastr.warning('La contraseña no se logro actualizar, vuelve a intentarlo', 'Restablecimiento fallido', {
          timeOut: 3000,
          enableHtml: true
        });
        this.submitted = false;
      }
    },
    (error) => {
      this.submitted = false;
      let message = '';
      if (typeof error.error.message === 'object') {
        for (let key in error.error.message) {
          let value = error.error.message[key];
          value.forEach((s: any) => {
            message += s + '<br />';
          });
        }
      } else {
        message = error.error.message;
        this.toastr.warning(message, 'Datos incorrectos', {
          timeOut: 3000,
          enableHtml: true,
        });
      }
    });
  }
}