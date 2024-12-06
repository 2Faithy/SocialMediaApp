import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage {
  isLogin: boolean = true; // Toggle state: true for login, false for signup
  email: string = '';
  password: string = '';
  isLoading: boolean = false; // For loading spinner during operations

  constructor(private auth: Auth, private router: Router) {}

  async handleAuth() {
    // Basic Input Validation
    if (!this.email || !this.password) {
      alert('Please fill in both email and password.');
      return;
    }
    if (this.password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    this.isLoading = true; // Start loading spinner

    try {
      if (this.isLogin) {
        // Login Logic
        const userCredential = await signInWithEmailAndPassword(this.auth, this.email, this.password);
        console.log('User logged in:', userCredential.user);
        this.router.navigate(['/home']);
      } else {
        // Signup Logic
        const userCredential = await createUserWithEmailAndPassword(this.auth, this.email, this.password);
        console.log('User registered:', userCredential.user);
        alert('Signup successful! You can now log in.');
        this.isLogin = true; // Switch to login after signup
      }
    } catch (error: any) {
      console.error('Authentication failed:', error);
      this.handleError(error); // Handle errors gracefully
    } finally {
      this.isLoading = false; // Stop loading spinner
    }
  }

  toggleAuthMode() {
    this.isLogin = !this.isLogin; // Toggle between login and signup
    this.clearFields(); // Clear input fields when toggling
  }

  private clearFields() {
    this.email = '';
    this.password = '';
  }

  private handleError(error: any) {
    const errorMessage = error?.message || 'An unknown error occurred.';
    if (error?.code === 'auth/weak-password') {
      alert('Password should be at least 6 characters.');
    } else if (error?.code === 'auth/invalid-email') {
      alert('Invalid email address.');
    } else if (error?.code === 'auth/user-not-found') {
      alert('No user found with this email. Please sign up.');
    } else if (error?.code === 'auth/email-already-in-use') {
      alert('This email is already in use. Please log in.');
    } else if (error?.code === 'auth/wrong-password') {
      alert('Incorrect password. Please try again.');
    } else {
      alert(errorMessage);
    }
  }
}
