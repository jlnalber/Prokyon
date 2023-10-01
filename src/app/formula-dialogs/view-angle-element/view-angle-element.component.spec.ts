import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAngleElementComponent } from './view-angle-element.component';

describe('ViewAngleElementComponent', () => {
  let component: ViewAngleElementComponent;
  let fixture: ComponentFixture<ViewAngleElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAngleElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAngleElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
