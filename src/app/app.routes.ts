import { Routes } from '@angular/router';
import { Posts } from './Pages/posts/posts';
import { DeclarativePosts } from './Pages/declarative-posts/declarative-posts';
import { AltPosts } from './Pages/alt-posts/alt-posts';
import { PostForm } from './Pages/post-form/post-form';

export const routes: Routes = [
  { path: '', component: Posts },
  { path: 'declarativePosts', component: DeclarativePosts },
  { path: 'declarativePosts/add', component: PostForm },
  { path: 'declarativePosts/edit/:id', component: PostForm },
  { path: 'altPosts', component: AltPosts },
];
