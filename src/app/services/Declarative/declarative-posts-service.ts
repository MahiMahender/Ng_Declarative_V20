import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  concatMap,
  map,
  merge,
  Observable,
  of,
  scan,
  shareReplay,
  Subject,
  tap,
  throwError,
  withLatestFrom,
} from 'rxjs';
import { CRUDAction, IPost } from '../../Modals/IPost';
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

  selectedPostSubject = new BehaviorSubject<string>('');
  selectedPostAction$ = this.selectedPostSubject.asObservable();

  selctedPost(postId: string) {
    this.selectedPostSubject.next(postId);
  }

  onClosePostSubject = new BehaviorSubject<boolean>(false);
  onClosePostAction$ = this.onClosePostSubject.asObservable();

  addPostSubject = new Subject<CRUDAction<IPost>>();
  addPostAction$ = this.addPostSubject.asObservable();

  allPosts$ = merge(
    this.postsWithCategories$,
    this.addPostAction$.pipe(
      concatMap((postAction: CRUDAction<IPost>) => this.savePost(postAction)),
    ),
  ).pipe(
    scan((posts: IPost[], value: IPost | IPost[]) => {
      if (Array.isArray(value)) {
        return value; // initial API load
      } else {
        return [...posts, value]; // add new post
      }
    }, [] as IPost[]),
    shareReplay(1),
  );

  post$ = combineLatest([this.allPosts$, this.selectedPostAction$]).pipe(
    map(([posts, selectedPostId]) => posts.find((post) => post.id == selectedPostId)),
    catchError(this.handleError),
  );
  categoryListMap$ = this.categoryService.categories$.pipe(
    map((categories) =>
      Object.fromEntries(categories.map((category) => [category.id, category.title])),
    ),
  );

  savePost(postAction: CRUDAction<IPost>): Observable<IPost> {
    if (postAction.action === 'ADD') {
      return this.addPostData(postAction.data).pipe(
        withLatestFrom(this.categoryListMap$),
        map(([savedPost, categories]) => ({
          ...savedPost,
          categoryName: categories[savedPost.categoryid] ?? '',
        })),
      );
    }
    return of(postAction.data as IPost);
  }

  addPostData(post: IPost) {
    return this.http
      .post<{
        name: string;
      }>('https://angular-rxjs-declarative-posts-default-rtdb.firebaseio.com/posts.json', post)
      .pipe(
        map((res) => {
          return {
            ...post,
            id: res.name,
          };
        }),
      );
  }

  updatePostSubject = new BehaviorSubject<boolean>(false);
  updatePostAction$ = this.updatePostSubject.asObservable();

  handleError(error: HttpErrorResponse) {
    return throwError(() => new Error('Unknow error occured plz try agin'));
  }
}
