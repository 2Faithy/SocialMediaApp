import { Component, OnInit } from '@angular/core';
import { CloudinaryService } from '../services/cloudinary.service';
import { Firestore, collection, addDoc, getDocs } from '@angular/fire/firestore';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

interface Profile {
  name: string;
  email: string;
  bio: string;
  profileImageUrl: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfileComponent implements OnInit {
  name: string = '';
  email: string = '';
  bio: string = '';
  uploadedImageUrl: string | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  savedProfile: Profile | null = null; // Define savedProfile property
  isProfileSaved = false; // Add flag for profile saved state

  constructor(
    private cloudinaryService: CloudinaryService,
    private firestore: Firestore,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  async loadProfile() {
    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Loading profile...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const querySnapshot = await getDocs(collection(this.firestore, 'profiles'));
      querySnapshot.forEach((doc) => {
        this.savedProfile = doc.data() as Profile;
      });
      if (this.savedProfile) {
        this.isProfileSaved = true;
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      this.isLoading = false;
      await loading.dismiss();
    }
  }

  async onFileSelected(event: Event) {
    console.log('File selected event triggered'); // Debugging log
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      console.log('File selected:', file.name); // Debugging log
      this.isLoading = true; // Start loading spinner
      this.errorMessage = null; // Reset error message

      const loading = await this.loadingController.create({
        message: 'Uploading image...',
        spinner: 'crescent'
      });
      await loading.present();
      console.log('Loading spinner presented'); // Debugging log

      try {
        this.uploadedImageUrl = await this.cloudinaryService.uploadImage(file);
        console.log('Image uploaded successfully:', this.uploadedImageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
        this.errorMessage = 'Failed to upload image. Please try again.'; // Set error message
      } finally {
        this.isLoading = false; // Stop loading spinner
        await loading.dismiss();
        console.log('Loading spinner dismissed'); // Debugging log
      }
    }
  }

  deleteImage() {
    this.uploadedImageUrl = null;
  }

  triggerFileInput() {
    // Programmatically trigger the file input to allow replacing the image
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  async saveProfile() {
    if (this.name && this.email && this.bio && this.uploadedImageUrl) {
      this.isLoading = true; // Start loading spinner
      const loading = await this.loadingController.create({
        message: 'Saving profile...',
        spinner: 'crescent'
      });
      await loading.present();

      try {
        const profilesCollection = collection(this.firestore, 'profiles');
        await addDoc(profilesCollection, {
          name: this.name,
          email: this.email,
          bio: this.bio,
          profileImageUrl: this.uploadedImageUrl
        });
        const toast = await this.toastController.create({
          message: 'Profile saved successfully!',
          duration: 2000,
          color: 'success'
        });
        await toast.present();
        this.isProfileSaved = true; // Set profile saved flag to true
      } catch (error) {
        console.error('Error saving profile:', error);
        const toast = await this.toastController.create({
          message: 'Failed to save profile. Please try again.',
          duration: 2000,
          color: 'danger'
        });
        await toast.present();
      } finally {
        this.isLoading = false; // Stop loading spinner
        await loading.dismiss();
        this.loadProfile(); // Reload profile to update displayed details
      }
    } else {
      const toast = await this.toastController.create({
        message: 'Please complete all fields and upload an image.',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
    }
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }
}
