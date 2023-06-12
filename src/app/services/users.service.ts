/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  updateEmail,
  sendEmailVerification,
  sendPasswordResetEmail,
  getAuth,
  onAuthStateChanged,
  UserCredential,
  setPersistence,
  browserSessionPersistence,
  User,
  authState,
  fetchSignInMethodsForEmail
} from '@angular/fire/auth';

import {
  CollectionReference,
  DocumentData,
} from '@firebase/firestore';

import { Firestore, collection, query, where, getDocs, doc, setDoc, updateDoc, QuerySnapshot } from '@angular/fire/firestore';
import { Observable, Subject, observable } from 'rxjs';
import { UsersList } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private userSubject = new Subject<any>();
  user$: Observable<User | null>;
  users$: Array<UsersList> = [];

  private userSession!: Promise<UserCredential>;

  constructor(
    private auth : Auth,
    private fb : Firestore,
  ) {
    this.user$ = authState(this.auth);
   }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  emailVerification() {
    return sendEmailVerification(this.auth.currentUser!)
  }

  loginWithGoogle(){
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  login(email: string, password: string) {
    this.userSession = signInWithEmailAndPassword(this.auth, email, password);
    this.userSubject.next(this.userSession);
    return this.userSession;
  }

  logout(){
    return signOut(this.auth);
  }

  async getUsers() {
    await getDocs(collection(this.fb, 'users')).then((data) => {
      data.forEach(data2 => {
        this.users$.push((data2.data() as UsersList))
      })
    }).catch((error) => console.log(error.message));
  }

  // updatePhotoProfile(id: string, urlImage: string) {
  //   return updateDoc(doc(this.firestore, 'user', id), {imgurl: urlImage});
  // }

  // updatePhotoFront(id: string, urlImage: string) {
  //   return updateDoc(doc(this.firestore, 'user', id), {imgFront: urlImage});
  // }

  updateProfile(name:string, photoURL: string, email: string) {
    updateProfile(this.auth.currentUser!, {
      displayName: name, photoURL: photoURL
    })
    updateEmail(this.auth.currentUser!, email)
  }

  resetPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email)
  }

  isLoggedIn(): boolean {
    return this.auth.currentUser? true : false;
  }

  async saveUser(id: string, user: object) {
    await setDoc(doc(this.fb, 'users', id), user, { merge: true });
  }

  checkPassword(email: string) {
    fetchSignInMethodsForEmail(this.auth, email).then(data => {
      if (!data.includes('password')) {
        this.resetPassword(email);
      }
    })
  }


  // isLoggedIn(): Observable<string | boolean> {
  //   return new Observable<string | boolean>((observer) => {
  //     return onAuthStateChanged(this.auth, (user) => {
  //       if (user) {
  //         const uid = user.uid;
  //         console.log(uid)
  //         observer.next(uid);
  //       } else {
  //         observer.next(false);
  //       }
  //     });
  //   });
  // }

}
