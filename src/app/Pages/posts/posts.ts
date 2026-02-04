import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { PostsService } from '../../services/Posts/posts-service';
import { IPost } from '../../Modals/IPost';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-posts',
  imports: [],
  templateUrl: './posts.html',
  styleUrl: './posts.css',
})
export class Posts implements OnInit, OnDestroy {
  posts: IPost[] = [];
  postsSubscription!: Subscription;

  postsService = inject(PostsService);

  ngOnInit(): void {
    this.loadPosts();
  }
  loadPosts() {
    this.postsSubscription = this.postsService.getPostsWithCategory().subscribe({
      next: (res) => {
        this.posts = res;
      },
    });
  }

  ngOnDestroy(): void {
    if (this.postsSubscription) {
      this.postsSubscription.unsubscribe();
    }
  }
}
