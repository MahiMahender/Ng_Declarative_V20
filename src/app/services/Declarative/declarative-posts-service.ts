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

  postCRUDSubject = new Subject<CRUDAction<IPost>>();
  postCRUDAction$ = this.postCRUDSubject.asObservable();

  allPosts$ = merge(
    this.postsWithCategories$,
    this.postCRUDAction$.pipe(
      concatMap((postAction: CRUDAction<IPost>) => this.savePost(postAction)),
    ),
  ).pipe(
    scan((posts: IPost[], value: IPost | IPost[]) => {
      //debugger;
      if (Array.isArray(value)) {
        return value; // initial API load
      } else {
        posts = posts.map((post) => (value.id === post.id ? value : post));
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
    let postDetails$!: Observable<IPost>;
    if (postAction.action === 'ADD') {
      postDetails$ = this.addPostData(postAction.data);
    }
    if (postAction.action === 'UPDATE') {
      postDetails$ = this.updatePost(postAction.data);
    }
    return postDetails$.pipe(
      withLatestFrom(this.categoryListMap$),
      map(([savedPost, categories]) => ({
        ...savedPost,
        categoryName: categories[savedPost.categoryid] ?? '',
      })),
    );
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

  updatePost(post: IPost) {
    return this.http.patch<IPost>(
      `https://angular-rxjs-declarative-posts-default-rtdb.firebaseio.com/posts/${post.id}.json`,
      post,
    );
  }

  updatePostSubject = new BehaviorSubject<boolean>(false);
  updatePostAction$ = this.updatePostSubject.asObservable();

  handleError(error: HttpErrorResponse) {
    return throwError(() => new Error('Unknow error occured plz try agin'));
  }
}
