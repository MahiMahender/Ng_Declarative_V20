import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ICategory } from '../../Modals/ICategory';
import { map, Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeclarativeCategoriesService {
  private http = inject(HttpClient);

  readonly categories$: Observable<ICategory[]> = this.http
    .get<{
      [id: string]: ICategory;
    }>('https://angular-rxjs-declarative-posts-default-rtdb.firebaseio.com/Categories.json')
    .pipe(
      map((categories) =>
        Object.entries(categories ?? {}).map(([id, category]) => ({
          ...category,
          id,
        })),
      ),
      shareReplay(1),
    );
}
