import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntersectionDialogComponent } from './intersection-dialog.component';

describe('IntersectionDialogComponent', () => {
  let component: IntersectionDialogComponent;
  let fixture: ComponentFixture<IntersectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntersectionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntersectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
