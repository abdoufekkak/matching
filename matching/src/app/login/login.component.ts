import { Component } from '@angular/core';
import { Login } from './model/login';
import { Router } from '@angular/router';
import { AuthService } from './login.service';
import { tap } from 'rxjs';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent {
  login: Login = new Login();
  constructor(private auth: AuthService, private router: Router) {}

  onlogin(username: string) {
    this.login.username = username;

    this.auth
    .login(this.login)
    .pipe(
      tap((value) => {
        this.router.navigateByUrl('/chat');
        localStorage.setItem('idUser', (value as {id:number}).id.toString()); // Correction ici
      })
    )
    .subscribe();
  }
}
