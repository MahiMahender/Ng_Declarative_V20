import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DeclarativePosts } from '../declarative-posts/declarative-posts';
import { DeclarativePostsService } from '../../services/Declarative/declarative-posts-service';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { IPost } from '../../Modals/IPost';
import { SinglePost } from '../../Components/single-post/single-post';
import { tap } from 'rxjs';
import { AddPost } from '../../Components/add-post/add-post';
import { UpdatePost } from '../../Components/update-post/update-post';

@Component({
  selector: 'app-alt-posts',
  imports: [AsyncPipe, SinglePost, AddPost, UpdatePost],
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
  updatePost$ = this.postsService.updatePostAction$;

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
    this.postsService.updatePostSubject.next(false);
  }

  onAddPost() {
    this.showAddPost = true;
    this.postsService.onClosePostSubject.next(false);
    this.postsService.updatePostSubject.next(false);
  }
}
