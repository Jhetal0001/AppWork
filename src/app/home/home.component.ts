import { Component } from '@angular/core';
import { UsersService } from '../services/users.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  isSession = false;
  constructor(
    private usersService: UsersService
    ) {

  }

  ngOnInit(): void {
    this.usersService.user$.subscribe(data => {
      if (data) {
        this.isSession = true;
      } else {
        this.isSession = false;
      }
    })
  }


}
