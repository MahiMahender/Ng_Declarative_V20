import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DeclarativePosts } from '../declarative-posts/declarative-posts';
import { DeclarativePostsService } from '../../services/Declarative/declarative-posts-service';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { IPost } from '../../Modals/IPost';
import { SinglePost } from '../../Components/single-post/single-post';
import { tap } from 'rxjs';
import { AddPost } from '../../Components/add-post/add-post';

@Component({
  selector: 'app-alt-posts',
  imports: [AsyncPipe, SinglePost, AddPost],
  templateUrl: './alt-posts.html',
  styleUrl: './alt-posts.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AltPosts {
  postsService = inject(DeclarativePostsService);
  showAddPost = false;
  closeAddPost$ = this.postsService.onClosePostAction$;
  //allPosts$ = this.postsService.allPosts$;
  selectedPostId = '';

  posts$ = this.postsService.allPosts$.pipe(
    tap((posts) => {
      if (!this.selectedPostId) {
        posts[0].id && this.postsService.selctedPost(posts[0].id);
        this.selectedPostId = posts[0].id as string;
      }
    }),
  );

  onSelectPost(post: IPost, event: Event) {
    event.preventDefault();
    if (post.id) {
      this.selectedPostId = post.id;
    }
    post.id && this.postsService.selctedPost(post.id);
    this.postsService.onClosePostSubject.next(true);
  }

  onAddPost() {
    this.showAddPost = true;
    this.postsService.onClosePostSubject.next(false);
  }
}
