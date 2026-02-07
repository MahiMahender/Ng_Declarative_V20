import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclarativePosts } from './declarative-posts';

describe('DeclarativePosts', () => {
  let component: DeclarativePosts;
  let fixture: ComponentFixture<DeclarativePosts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeclarativePosts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeclarativePosts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
