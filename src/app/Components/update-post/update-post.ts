import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DeclarativeCategoriesService } from '../../services/DeclarativeCategories/declarative-categories-service';

import { AsyncPipe } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { DeclarativePostsService } from '../../services/Declarative/declarative-posts-service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-update-post',
  imports: [AsyncPipe, ReactiveFormsModule],
  templateUrl: './update-post.html',
  styleUrl: './update-post.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatePost {
  categoryService = inject(DeclarativeCategoriesService);
  postService = inject(DeclarativePostsService);

  categories$ = this.categoryService.categories$;

  updatePostForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    categoryid: new FormControl(''),
  });

  post$ = this.postService.post$.pipe(
    tap((post) => {
      if (post) {
        this.updatePostForm.setValue({
          title: post?.title,
          categoryid: post?.categoryid,
          description: post?.description,
        });
      }
    }),
  );
}
