import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ICategory } from '../../Modals/ICategory';
import { map, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  http = inject(HttpClient);

  getAllCategories() {
    return this.http
      .get<{
        [id: string]: ICategory;
      }>('https://angular-rxjs-declarative-posts-default-rtdb.firebaseio.com/Categories.json')
      .pipe(
        map((res) => {
          let categories: ICategory[] = [];
          for (let id in res) {
            categories.push({ ...res[id], id });
          }
          return categories;
        }),
        shareReplay(1),
      );
  }
}
