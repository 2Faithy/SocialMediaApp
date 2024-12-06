import { Component, OnInit, OnDestroy } from '@angular/core';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  user: User | null = null;
  authSubscription: Subscription | null = null;

  constructor(private auth: Auth, private router: Router) {}

  ngOnInit() {
    this.authSubscription = new Subscription();
    this.authSubscription.add(
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          this.user = user;
        } else {
          this.router.navigate(['/auth']);
        }
      })
    );
  }

  logout() {
    this.auth.signOut()
      .then(() => {
        this.router.navigate(['/auth']);
      })
      .catch((error) => {
        console.error('Logout failed:', error);
        alert('Failed to logout. Please try again.');
      });
  }

  navigateToFeature(feature: string) {
    const routes: { [key: string]: string } = {
      profile: '/profile',
      'create-post': '/create-post',
      'posts' : '/posts'
    };

    if (routes[feature]) {
      this.router.navigate([routes[feature]]);
    } else {
      console.error('Invalid feature:', feature);
      alert('Feature not available.');
    }
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
