import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DeclarativePostsService } from '../../services/Declarative/declarative-posts-service';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, catchError, EMPTY, of } from 'rxjs';
import { IPost } from '../../Modals/IPost';

@Component({
  selector: 'app-single-post',
  imports: [AsyncPipe],
  templateUrl: './single-post.html',
  styleUrl: './single-post.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SinglePost {
  errorMsgSubject = new BehaviorSubject<string>('');
  errorMsgAction$ = this.errorMsgSubject.asObservable();

  postsService = inject(DeclarativePostsService);

  post$ = this.postsService.post$.pipe(
    catchError((error) => {
      this.errorMsgSubject.next(error);
      return EMPTY;
    }),
  );

  onUpdatePost() {
    this.postsService.updatePostSubject.next(true);
    this.postsService.onClosePostSubject.next(false);
  }
}
