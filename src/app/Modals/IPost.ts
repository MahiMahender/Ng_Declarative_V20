export interface IPost {
  id?: string;
  categoryid: string;
  description: string;
  title: string;
  categoryName?: string;
  delete?: boolean;
}

export interface CRUDAction<T> {
  action: 'ADD' | 'UPDATE' | 'DELETE';
  data: T;
}
