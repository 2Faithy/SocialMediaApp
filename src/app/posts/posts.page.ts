import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, doc, updateDoc, deleteDoc, arrayUnion, increment } from '@angular/fire/firestore';
import { Router } from '@angular/router';

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl: string;
  creatorId: string;
  likes: number;
  comments: { userId: string; content: string }[];
}

@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
})
export class PostsPage implements OnInit {
  posts: Post[] = [];
  newComment: string = '';
  activePostId: string | null = null;
  comments: { [key: string]: { userId: string; content: string }[] } = {};

  constructor(private firestore: Firestore, private router: Router) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    const postsCollection = collection(this.firestore, 'posts');
    collectionData(postsCollection, { idField: 'id' }).subscribe((data) => {
      this.posts = data as Post[];
      this.posts.forEach((post) => {
        this.comments[post.id] = post.comments || [];
      });
    });
  }

  editPost(post: Post) {
    const newContent = prompt('Edit the post content:', post.content);
    if (newContent) {
      const postDoc = doc(this.firestore, `posts/${post.id}`);
      updateDoc(postDoc, { content: newContent }).then(() => {
        console.log('Post updated successfully');
      });
    }
  }

  deletePost(postId: string) {
    const confirmDelete = confirm('Are you sure you want to delete this post?');
    if (confirmDelete) {
      const postDoc = doc(this.firestore, `posts/${postId}`);
      deleteDoc(postDoc).then(() => {
        console.log('Post deleted successfully');
      });
    }
  }

  likePost(postId: string) {
    const postDoc = doc(this.firestore, `posts/${postId}`);
    updateDoc(postDoc, { likes: increment(1) }).then(() => {
      console.log('Post liked successfully');
    });
  }

  addComment(postId: string | null) {
    if (!postId || !this.newComment.trim()) return;

    const postDoc = doc(this.firestore, `posts/${postId}`);
    updateDoc(postDoc, {
      comments: arrayUnion({ userId: 'Anonymous', content: this.newComment }),
    }).then(() => {
      console.log('Comment added successfully');
      this.comments[postId].push({ userId: 'Anonymous', content: this.newComment });
      this.newComment = '';
    });
  }

  toggleComments(postId: string) {
    this.activePostId = this.activePostId === postId ? null : postId;
  }

  navigateToHome() {
    this.router.navigate(['/home']); // Adjust the route as per your home page setup.
  }
  
}
