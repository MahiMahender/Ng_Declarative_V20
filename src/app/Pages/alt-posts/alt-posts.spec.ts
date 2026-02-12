import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltPosts } from './alt-posts';

describe('AltPosts', () => {
  let component: AltPosts;
  let fixture: ComponentFixture<AltPosts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AltPosts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AltPosts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
