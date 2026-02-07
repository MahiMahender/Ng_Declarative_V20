import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IPost } from '../../Modals/IPost';
import { NgIf, AsyncPipe } from '@angular/common';
import { DeclarativePostsService } from '../../services/Declarative/declarative-posts-service';

@Component({
  selector: 'app-declarative-posts',
  imports: [NgIf, AsyncPipe],
  templateUrl: './declarative-posts.html',
  styleUrl: './declarative-posts.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeclarativePosts {
  declarativePosts = inject(DeclarativePostsService);

  /* posts$: Observable<IPost[]> = this.declarativePosts.posts$; */
  posts$: Observable<IPost[]> = this.declarativePosts.postsWithCategories$;
}
