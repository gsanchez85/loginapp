import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from '../../models/usuario.model';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MessagesComponent } from '../messages/messages.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  usuario: UsuarioModel;
  msm: MessagesComponent;
  remeberAuth: boolean;

  constructor( private auth: AuthService, private router: Router ) {
    this.usuario = new UsuarioModel();
    this.msm = new MessagesComponent();
    this.remeberAuth = false;
   }

  ngOnInit() {

  }

  onSubmit( form: NgForm ) {
    if ( form.invalid ) {
       return;
    }
    this.msm.showMessageAuth('Espere por favor...', 'info', true);
    this.auth.nuevoUsuario( this.usuario ).subscribe( resp => {
      console.log(resp);
      this.msm.closeMessage();
      if ( this.remeberAuth ) {
        localStorage.setItem( 'email', this.usuario.email );
      }
      this.router.navigateByUrl('/home');
    }, (err) => {
      this.msm.closeMessage();
      this.msm.showMessageAuth( err.error.error.message, 'error', false);
    }
    );
  }

}
