import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [
    trigger('navbar', [
      state('false', style({ width: '2.5rem' })),
      state('true', style({ width: '125px'})),
      transition('false <-> true', [
        animate('300ms', style({ width: '*' }))
      ]),
      // transition('true -> false', [
      //   animate('300ms ease-out', style({ width: '2.5rem' }))
      // ])
    ])
  ]
})
export class NavbarComponent implements OnInit {

  navInfo = false;
  isSession = false;
  imgProfile:string | null = '/src/assets/profilDefault.png';
  nameProfile: string | undefined | null = 'Anonimo';

  constructor(private usersService: UsersService, private router: Router) {}

  logOut() {
    this.usersService.logout();
    this.router.navigate(['home']);
  }

  onEvent(){
    this.navInfo = true;
  }
  ngOnInit(): void {
    this.usersService.user$.subscribe(data => {
      if (data) {
        this.imgProfile = data.photoURL;
        const firstName = data.displayName?.split(/\s+/);
        this.nameProfile = firstName? firstName[0]: null;
        this.isSession = true;
      } else {
        this.isSession = false;
      }
    })
  }
}
