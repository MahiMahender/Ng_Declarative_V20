import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, combineLatest, map, Observable, shareReplay, Subject, throwError } from 'rxjs';
import { IPost } from '../../Modals/IPost';
import { DeclarativeCategoriesService } from '../DeclarativeCategories/declarative-categories-service';

@Injectable({
  providedIn: 'root',
})
export class DeclarativePostsService {
  private http = inject(HttpClient);
  private categoryService = inject(DeclarativeCategoriesService);

  readonly posts$: Observable<IPost[]> = this.http
    .get<{
      [id: string]: IPost;
    }>('https://angular-rxjs-declarative-posts-default-rtdb.firebaseio.com/posts.json')
    .pipe(
      map((posts) =>
        Object.entries(posts ?? {}).map(([id, post]) => ({
          ...post,
          id,
        })),
      ),
      shareReplay(1),
      catchError(this.handleError),
    );

  /* If i deal with Array of Objects */
  /*  pipe(
  map(posts => 
    (posts ?? []).map((post, index) => ({
      ...post,
      id: post.id ?? index // Keep existing ID or use the array index
    }))
  )
); */

  readonly postsWithCategories$ = combineLatest([
    this.posts$,
    this.categoryService.categories$,
  ]).pipe(
    map(([posts, categories]) => {
      return posts.map((post) => ({
        ...post,
        categoryName: categories.find((category) => category.id === post.categoryid)?.title,
      }));
    }),
    shareReplay(1),
    catchError(this.handleError),
  );

  selectedPostSubject = new Subject<string>();
  selectedPostAction$ = this.selectedPostSubject.asObservable();

  selctedPost(postId: string) {
    this.selectedPostSubject.next(postId);
  }
  post$ = combineLatest([this.postsWithCategories$, this.selectedPostAction$]).pipe(
    map(([posts, selectedPostId]) => posts.find((post) => post.id == selectedPostId)),
    shareReplay(1),
    catchError(this.handleError),
  );

  handleError(error: HttpErrorResponse) {
    return throwError(() => new Error('Unknow error occured plz try agin'));
  }
}
