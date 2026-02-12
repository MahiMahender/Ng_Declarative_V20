import { Component, inject } from '@angular/core';
import { DeclarativePosts } from '../declarative-posts/declarative-posts';
import { DeclarativePostsService } from '../../services/Declarative/declarative-posts-service';
import { AsyncPipe } from '@angular/common';
import { IPost } from '../../Modals/IPost';

@Component({
  selector: 'app-alt-posts',
  imports: [AsyncPipe],
  templateUrl: './alt-posts.html',
  styleUrl: './alt-posts.css',
})
export class AltPosts {
  postsService = inject(DeclarativePostsService);

  posts$ = this.postsService.postsWithCategories$;

  onSelectPost(post: IPost, event: Event) {
    event.preventDefault();
    console.log(post);
  }
}
