import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://identitytoolkit.googleapis.com/v1';
  private apikey = 'API KEY';
  userToken: string;

  // Info:
  // https://firebase.google.com/docs/reference/rest/auth#section-create-email-password

  // Crear nuevos usuarios
  // https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=[API_KEY]

  // Login
  // https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

    constructor( private http: HttpClient ) {
      this.leerToken();
    }

    logout() {
      localStorage.removeItem('token');
    }

    login( usuario: UsuarioModel ) {
      const AUTHDATA = {
        /*email: usuario.email,
          password: usuario.password,*/
        // Una manera de resumir lo anterior es poner ...usuario
        ...usuario,
        returnSecureToken: true
      };
      // Llamar a nuestro servicio http para crear un usuario
      return this.http.post(
        `${ this.url }/accounts:signInWithPassword?key=${ this.apikey }`,
        AUTHDATA
      ).pipe(
        // Leer el token y almacenarlo. Si el post devuelve un error el map nunca se dispara.
        map( resp => {
          // tslint:disable-next-line:no-string-literal
          this.guardarToken( resp['idToken'] );
          return resp;
        })
      );
    }

    nuevoUsuario( usuario: UsuarioModel ) {
      const AUTHDATA = {
        ...usuario,
        returnSecureToken: true
      };
      return this.http.post(
        `${ this.url }/accounts:signUp?key=${ this.apikey }`,
        AUTHDATA
      ).pipe(
        // Leer el token y almacenarlo. Si el post devuelve un error el map nunca se dispara.
        map( resp => {
          // tslint:disable-next-line:no-string-literal
          this.guardarToken( resp['idToken'] );
          return resp;
        })
      );
    }

    private guardarToken( idToken: string ) {
      this.userToken = idToken;
      localStorage.setItem( 'token', idToken );
      let hoy = new Date();
      hoy.setSeconds( 3600 );

      localStorage.setItem( 'expira', hoy.getTime().toString() );
    }

    leerToken() {
      if ( localStorage.getItem('token') ) {
        this.userToken = localStorage.getItem('token');
      } else {
        this.userToken = '';
      }
      return this.userToken;
    }

    estaAutenticado(): boolean {
      if ( this.userToken.length < 2 ) {
        return false;
      }
      const EXPIRA = Number( localStorage.getItem('expira') );
      const EXPIRA_DATE = new Date();
      EXPIRA_DATE.setTime(EXPIRA);
      if ( EXPIRA_DATE > new Date() ) {
        return true;
      } else {
          return false;
        }
    }

}
