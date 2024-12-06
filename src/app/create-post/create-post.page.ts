import { Component, OnInit } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { CloudinaryService } from '../services/cloudinary.service'; // Ensure CloudinaryService is imported
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.page.html',
  styleUrls: ['./create-post.page.scss'],
})
export class CreatePostPage implements OnInit {
  postTitle: string = '';
  postContent: string = '';
  selectedCategory: string = '';
  selectedFile: File | null = null;
  isLoading: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private firestore: Firestore,
    private cloudinaryService: CloudinaryService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private router: Router
  ) { }

  ngOnInit() { }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async createPost() {
    this.isLoading = true; // Show loading spinner
    this.successMessage = null; // Reset success message
    this.errorMessage = null; // Reset error message

    const loading = await this.loadingController.create({
      message: 'Creating post...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      let imageUrl = '';

      if (this.selectedFile) {
        imageUrl = await this.cloudinaryService.uploadImage(this.selectedFile);
      }

      const postsCollection = collection(this.firestore, 'posts');
      await addDoc(postsCollection, {
        title: this.postTitle,
        content: this.postContent,
        category: this.selectedCategory,
        imageUrl: imageUrl,
        createdAt: new Date()
      });

      this.successMessage = 'Post created successfully!';
    } catch (error) {
      console.error('Error creating post:', error);
      this.errorMessage = 'Failed to create post. Please try again.';
    } finally {
      this.isLoading = false; // Hide loading spinner
      await loading.dismiss();
    }
  }
  navigateToHome() {
    this.router.navigate(['/home']); // Adjust the route as per your home page setup.
  }
}
