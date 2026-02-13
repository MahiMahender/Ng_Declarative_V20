import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DeclarativePosts } from '../declarative-posts/declarative-posts';
import { DeclarativePostsService } from '../../services/Declarative/declarative-posts-service';
import { AsyncPipe } from '@angular/common';
import { IPost } from '../../Modals/IPost';
import { SinglePost } from '../../Components/single-post/single-post';

@Component({
  selector: 'app-alt-posts',
  imports: [AsyncPipe, SinglePost],
  templateUrl: './alt-posts.html',
  styleUrl: './alt-posts.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AltPosts {
  postsService = inject(DeclarativePostsService);

  posts$ = this.postsService.postsWithCategories$;

  onSelectPost(post: IPost, event: Event) {
    event.preventDefault();
    post.id && this.postsService.selctedPost(post.id);
    console.log(post);
  }
}
