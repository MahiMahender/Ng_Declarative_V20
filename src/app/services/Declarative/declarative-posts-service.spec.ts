import { TestBed } from '@angular/core/testing';

import { DeclarativePostsService } from './declarative-posts-service';

describe('DeclarativePostsService', () => {
  let service: DeclarativePostsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeclarativePostsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
