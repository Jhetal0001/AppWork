import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from 'src/app/services/modal.service';
import { UsersService } from 'src/app/services/users.service';
import { SignupComponent } from 'src/app/components/signup/signup.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isSession = false;
  imgProfile:string | null = '/src/assets/profilDefault.png';
  theme: string;

  constructor(
    private usersService: UsersService,
    private router: Router,
    private ngbModal: NgbModal,
    private renderer: Renderer2
    ) {
      const appHtml = document.getElementById('appHtml');
      this.theme = localStorage.getItem('theme') || appHtml?.getAttribute('data-bs-theme') || '';
      this.initTheme();
  }

  initTheme() {
    const appHtml = document.getElementById('appHtml');
    this.renderer.setAttribute(appHtml, 'data-bs-theme', this.theme);
  }

  toggleTheme() {
    const appHtml = document.getElementById('appHtml');
    if (appHtml) {
      const currentTheme = appHtml.getAttribute('data-bs-theme');
      const newTheme = currentTheme === 'auto' ? 'dark' : 'auto';
      this.theme = newTheme;
      this.renderer.setAttribute(appHtml, 'data-bs-theme', newTheme);
      localStorage.setItem('theme', newTheme? newTheme : '')
    }
  }

  modalSignUp() {
    this.ngbModal.open(SignupComponent, { centered: true });
  }

  logOut() {
    this.usersService.logout();
    this.router.navigate(['home']);
  }



  ngOnInit(): void {
    this.usersService.user$.subscribe(data => {
      if (data) {
        this.imgProfile = data.photoURL;
        this.isSession = true;
      } else {
        this.isSession = false;
      }
    })
  }

}
