import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  constructor(private auth: Auth, private router: Router) {
    onAuthStateChanged(this.auth, (user) => {
      this.user.next(user);
    });
  }

  // Sign up method
  signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        console.log('User signed up:', userCredential.user);
        this.router.navigate(['/home']); // Navigate to home page after successful sign-up
      })
      .catch((error) => {
        console.error('Sign-up error:', error.message);
      });
  }

  // Log in method
  signIn(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        console.log('User signed in:', userCredential.user);
        this.router.navigate(['/home']); // Navigate to home page after successful login
      })
      .catch((error) => {
        console.error('Login error:', error.message);
      });
  }

  // Log out method
  signOutUser() {
    return signOut(this.auth)
      .then(() => {
        console.log('User signed out');
        this.router.navigate(['/auth']); // Redirect to login page after logout
      })
      .catch((error) => {
        console.error('Sign-out error:', error.message);
      });
  }

  // Check if user is authenticated
  isLoggedIn(): boolean {
    return !!this.user.value;
  }

  // Observable for auth state
  getUser() {
    return this.user.asObservable();
  }
}
