import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DeclarativeCategoriesService } from '../../services/DeclarativeCategories/declarative-categories-service';
import { AsyncPipe } from '@angular/common';
import { DeclarativePostsService } from '../../services/Declarative/declarative-posts-service';
import { IPost } from '../../Modals/IPost';

@Component({
  selector: 'app-add-post',
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './add-post.html',
  styleUrl: './add-post.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPost {
  categoryService = inject(DeclarativeCategoriesService);
  postService = inject(DeclarativePostsService);

  categories$ = this.categoryService.categories$;
  postFormData = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    categoryid: new FormControl(''),
  });

  onAddPost() {
    this.postService.addPostSubject.next({ action: 'ADD', data: this.postFormData.value as IPost });
  }
  onClosePost() {
    this.postService.onClosePostSubject.next(true);
  }
}
