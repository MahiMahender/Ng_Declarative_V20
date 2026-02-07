import { Routes } from '@angular/router';
import { Posts } from './Pages/posts/posts';
import { DeclarativePosts } from './Pages/declarative-posts/declarative-posts';

export const routes: Routes = [
  { path: '', component: Posts },
  { path: 'declarativePosts', component: DeclarativePosts },
];
