import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Utils } from 'src/app/common/utils';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-restore-password',
  templateUrl: './restore-password.component.html',
  styleUrls: []
})

export class RestorePasswordComponent implements OnInit {

  public email      : string  = '';
  public submitted  : boolean = false;

  constructor(
    private api: ApiService,
    private utils: Utils,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void { }

  onSubmit() {
    this.submitted = true;
    this.api.resetPassword({ email: this.email }).subscribe(
      (e: any) => {
        this.submitted = false;
        if (e.result) {
          this.toastr.success('Te hemos enviado un correo electrónico para recuperar tu cuenta', 'Solicitud aceptada', {
            timeOut: 3000,
            enableHtml: true,
          });
        } else {
          this.toastr.warning(e.message, 'Advertencia', {
            timeOut: 3000,
            enableHtml: true,
          });
        }
      },
      (error) => {
        this.submitted = false;
        let message = this.utils.getErrorMessage(error);
        this.toastr.warning(message, 'Advertencia', {
          timeOut: 3000,
          enableHtml: true,
        });
      }
    );
  }
}