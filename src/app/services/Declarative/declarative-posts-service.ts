import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IPost } from '../../Modals/IPost';

@Injectable({
  providedIn: 'root',
})
export class DeclarativePostsService {
  private http = inject(HttpClient);

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
}
