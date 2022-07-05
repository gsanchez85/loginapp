import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  public showMessageAuth( msm: string, tp: string, isShowLoading: boolean ) {
    // Traducción de mensajes
    let sTypeError: string;
    let err: boolean;

    if ( tp === 'error' ) {
      err = true;
    } else {
      err = false;
    }
    sTypeError = '';
    if ( err ) {
      sTypeError = 'Error al autenticar: ';
      if ( msm === 'EMAIL_NOT_FOUND' ) {
        sTypeError += 'Email no registrado';
      } else if ( msm === 'INVALID_PASSWORD' ) {
          sTypeError += 'El password no es correcto';
        } else if ( msm === 'EMAIL_EXISTS' ) {
            sTypeError += 'El email ya existe';
        } else {
            sTypeError += msm;
          }
      msm = sTypeError;
    }
    //
    if ( tp === 'info' ) {
      Swal.fire({
        allowOutsideClick: false,
        text: msm,
        icon: 'info'
      });
    } else {
        Swal.fire({
          allowOutsideClick: false,
          text: msm,
          icon: 'error'
       });
    }
    if ( isShowLoading ) {
      Swal.showLoading();
    }
  }

  public closeMessage() {
    Swal.close();
  }
}
