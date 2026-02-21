import { Component, inject } from '@angular/core';
import { DeclarativeCategoriesService } from '../../services/DeclarativeCategories/declarative-categories-service';
import { AsyncPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DeclarativePostsService } from '../../services/Declarative/declarative-posts-service';
import { combineLatest, map, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post-form',
  imports: [AsyncPipe, ReactiveFormsModule],
  templateUrl: './post-form.html',
  styleUrl: './post-form.css',
})
export class PostForm {
  categoryService = inject(DeclarativeCategoriesService);
  postService = inject(DeclarativePostsService);
  route = inject(ActivatedRoute);

  categories$ = this.categoryService.categories$;
  post$ = this.postService.post$.pipe(
    tap((post) => {
      if (post) {
        this.postForm.setValue({
          title: post?.title,
          description: post?.description,
          categoryid: post?.categoryid,
        });
      }
    }),
  );

  selectedPostId = this.route.paramMap.pipe(
    map((paramMap) => {
      let id = paramMap.get('id');
      this.postService.selctedPost(id + '');
      return id;
    }),
  );
  postData$ = combineLatest([this.selectedPostId, this.post$]);

  postForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    categoryid: new FormControl(''),
  });

  onPostSubmit() {
    console.log(this.postForm.value);
  }
}
