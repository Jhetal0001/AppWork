import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { UsersService } from './users.service';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  private isAdmin = new BehaviorSubject<boolean>(false);
  private uid = '9ZhCxIXQSbciCUzKHBftg48adKA3'
  constructor(private usersService: UsersService, private auth : Auth) {
    auth.onAuthStateChanged((data) => {
      if (data && data.uid === this.uid) {
        this.isAdmin.next(true);
      } else {
        this.isAdmin.next(false);
      }
    })
  }

  private alertSubject = new Subject<any>();
  alert$ = this.alertSubject.asObservable();

  private loadingSubject = new Subject<any>();
  loadind$ = this.loadingSubject.asObservable();

  private lightboxSubject = new Subject<any>();
  lightbox$ = this.lightboxSubject.asObservable();


  showAlert(message: string, type: string) {
    this.alertSubject.next({ message, type });
  }
  clearAlert() {
    this.alertSubject.next(null);
  }

  showLoad() {
    this.loadingSubject.next(true);
  }
  hideLoad() {
    this.loadingSubject.next(false);
  }

  role(){
    return this.isAdmin.asObservable();
  }
}
