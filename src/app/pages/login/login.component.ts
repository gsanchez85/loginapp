import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuarioModel } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';
import { MessagesComponent } from '../messages/messages.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: UsuarioModel;
  msm: MessagesComponent;
  remeberAuth: boolean;

  constructor( private auth: AuthService, private router: Router ) {
    this.usuario = new UsuarioModel();
    this.msm = new MessagesComponent();
    this.remeberAuth = false;
  }

  ngOnInit() {
    if ( localStorage.getItem( 'email' ) ) {
      this.usuario.email = localStorage.getItem( 'email' );
      this.remeberAuth = true;
    }
  }

  login( form: NgForm ) {
    if ( form.invalid ) {
       return;
    }
    this.msm.showMessageAuth( 'Espere por favor...', 'info', true );
    this.auth.login( this.usuario ).subscribe( resp => {
      this.msm.closeMessage();
      if ( this.remeberAuth ) {
        localStorage.setItem( 'email', this.usuario.email );
      }
      this.router.navigateByUrl('/home');
    }, (err) => {
      this.msm.closeMessage();
      this.msm.showMessageAuth( err.error.error.message, 'error', false );
    });
  }

}
