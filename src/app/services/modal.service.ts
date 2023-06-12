import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private closeModalSubject = new Subject<void>();

  closeModal$ = this.closeModalSubject.asObservable();

  close() {
    this.closeModalSubject.next();
  }
}
