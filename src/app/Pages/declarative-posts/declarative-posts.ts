import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BehaviorSubject, combineLatest, filter, map, Observable, Subject } from 'rxjs';
import { IPost } from '../../Modals/IPost';
import { NgIf, AsyncPipe } from '@angular/common';
import { DeclarativePostsService } from '../../services/Declarative/declarative-posts-service';
import { CategoryService } from '../../services/Category/category-service';
import { DeclarativeCategoriesService } from '../../services/DeclarativeCategories/declarative-categories-service';
import { ICategory } from '../../Modals/ICategory';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-declarative-posts',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './declarative-posts.html',
  styleUrl: './declarative-posts.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeclarativePosts {
  declarativePostsService = inject(DeclarativePostsService);
  declarativeCategoryService = inject(DeclarativeCategoriesService);

  selectCategoryIdSubject = new BehaviorSubject<string>('');
  selectCategoryIdAction = this.selectCategoryIdSubject.asObservable();

  selectedCategoryId = '';

  /* posts$: Observable<IPost[]> = this.declarativePosts.posts$; */
  posts$: Observable<IPost[]> = this.declarativePostsService.postsWithCategories$;
  categories$: Observable<ICategory[]> = this.declarativeCategoryService.categories$;

  /* filteredPosts$ = this.posts$.pipe(
    map((posts) => {
      return posts.filter((post) =>
        this.selectedCategoryId ? post.categoryid === this.selectedCategoryId : true,
      );
    }),
  ); */

  filteredPosts$ = combineLatest([this.posts$, this.selectCategoryIdAction]).pipe(
    map(([posts, selectedCategoryId]) => {
      return posts.filter((post) =>
        selectedCategoryId ? post.categoryid === selectedCategoryId : true,
      );
    }),
  );

  onChangeCategory(event: Event) {
    let selectedCategoryId = (event.target as HTMLSelectElement).value;
    //this.selectedCategoryId = selectedCategoryId;
    this.selectCategoryIdSubject.next(selectedCategoryId);
  }
}
