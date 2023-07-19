import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class Utils {

  // Obtiene el error que vengan en las peticiones
  getErrorMessage(error: any): string {
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
    }
    return message;
  }

  // Crear un cadena aleatoria del tamaño que ingrese como parametro 
  createRamdomString(length: number = 8) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}