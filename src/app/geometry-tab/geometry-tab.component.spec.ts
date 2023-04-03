import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeometryTabComponent } from './geometry-tab.component';

describe('GeometryTabComponentComponent', () => {
  let component: GeometryTabComponent;
  let fixture: ComponentFixture<GeometryTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeometryTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeometryTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
