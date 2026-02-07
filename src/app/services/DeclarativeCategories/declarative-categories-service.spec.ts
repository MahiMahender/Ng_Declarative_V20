import { TestBed } from '@angular/core/testing';

import { DeclarativeCategoriesService } from './declarative-categories-service';

describe('DeclarativeCategoriesService', () => {
  let service: DeclarativeCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeclarativeCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
