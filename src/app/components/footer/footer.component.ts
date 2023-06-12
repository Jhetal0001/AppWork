import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  isSession= false;
  constructor(private usersService: UsersService){}

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
