import { Component, inject } from '@angular/core';
import { DeclarativeCategoriesService } from '../../services/DeclarativeCategories/declarative-categories-service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-post-form',
  imports: [AsyncPipe],
  templateUrl: './post-form.html',
  styleUrl: './post-form.css',
})
export class PostForm {
  categoryService = inject(DeclarativeCategoriesService);
  categories$ = this.categoryService.categories$;
}
