import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MeProfileService } from 'src/app/services/meProfile.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: []
})

export class ContactUsComponent implements OnInit {

  public email      : string = '';
  public name       : string = '';
  public phone      : string = '';
  public asunto     : string = '';
  public message    : string = '';
  public submitted  : boolean = false;

  constructor(
    private toastr: ToastrService,
    private _api: MeProfileService,
  ) { }

  ngOnInit(): void { }

  onSubmit() {
    this.submitted = true;
    let data = {
      email: this.email,
      name: this.name,
      phone: this.phone,
      subject: this.asunto,
      message: this.message,
    };
    this._api.contactUs(data).subscribe(
      (data: any) => {
        this.submitted = false;
        this.toastr.success('Su mensaje fue enviado correctamente, pronto se pondrán en contacto usted ' + this.name, 'Solictud enviada', {
          timeOut: 3000,
          enableHtml: true,
        });
      },
      error => {
        this.submitted = false;
        this.toastr.warning('No se logro enviar su solictud', 'Solicitud falló', {
          timeOut: 3000,
          enableHtml: true,
        });
      }
    );
  }
}