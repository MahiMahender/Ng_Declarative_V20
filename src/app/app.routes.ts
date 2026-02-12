import { Routes } from '@angular/router';
import { Posts } from './Pages/posts/posts';
import { DeclarativePosts } from './Pages/declarative-posts/declarative-posts';
import { AltPosts } from './Pages/alt-posts/alt-posts';

export const routes: Routes = [
  { path: '', component: Posts },
  { path: 'declarativePosts', component: DeclarativePosts },
  { path: 'altPosts', component: AltPosts },
];
