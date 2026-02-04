import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IPost } from '../../Modals/IPost';
import { map, mergeMap } from 'rxjs';
import { CategoryService } from '../Category/category-service';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  http = inject(HttpClient);
  categoryService = inject(CategoryService);

  getPosts() {
    return this.http
      .get<{
        [id: string]: IPost;
      }>('https://angular-rxjs-declarative-posts-default-rtdb.firebaseio.com/posts.json')
      .pipe(
        map((posts) => {
          let postsData: IPost[] = [];

          for (let id in posts) {
            postsData.push({ ...posts[id], id });
          }
          return postsData;
        }),
      );
  }

  getPostsWithCategory() {
    return this.getPosts().pipe(
      mergeMap((posts) => {
        return this.categoryService.getAllCategories().pipe(
          map((categories) => {
            return posts.map((post) => {
              return {
                ...post,
                categoryName: categories.find((category) => category.id == post.categoryid)?.title,
              };
            });
          }),
        );
      }),
    );
  }
}
