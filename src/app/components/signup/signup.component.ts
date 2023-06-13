import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { UtilsService } from 'src/app/services/utils.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  formLogin!: FormGroup;
  errorLogin: boolean | null = null;

  constructor(
    private usersService: UsersService,
    private router: Router,
    private UTILS: UtilsService,
    public activeModal: NgbActiveModal
    ) {

  }

  signupEmailPassword() {
    const email = this.formLogin.get('email')?.value;
    const password = this.formLogin.get('password')?.value;
    this.usersService
      .login(email, password)
      .then(() => {
        this.activeModal.dismiss();
        this.router.navigate(['gestionar']);
      })
      .catch((error) => {
        this.UTILS.showAlert(error.message, 'danger');
      });
  }

  signupGoogle() {
    this.usersService
      .loginWithGoogle()
      .then(async (result) => {
        const userResult = result.user;
        const user = {name: userResult.displayName, photoURL: userResult.photoURL, id: userResult.uid }
        this.usersService.saveUser(userResult.uid, user);
        if (userResult.email) {this.usersService.checkPassword(userResult.email);}
        this.activeModal.dismiss();
        this.router.navigate(['gestionar']);
        this.UTILS.showAlert('Si es tu primer ingreso a la plataforma, por favor ve al email y asigna una contraseña de inicio de sesión!', 'info');
      })
      .catch((error) => {
        this.UTILS.showAlert(error.message, 'danger');

      });
  }
  resetPassword() {
    const email = this.formLogin.get('email')?.value;
    if (email !== '') {
      this.usersService
        .resetPassword(email)
        .then(() => {
          this.UTILS.showAlert(`Se ha enviado el link al email: '${email}' para restrablecer la contraseña`, 'info');
        })
        .catch((error) => {
          this.UTILS.showAlert(error.message, 'danger');

        });
    } else {
      this.UTILS.showAlert('Debe digitar un email', 'danger');
    }
  }

  ngOnInit(): void {
    this.formLogin = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });

  }
}
