import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAbstractLineElementComponent } from './view-abstract-line-element.component';

describe('ViewAbstractLineElementComponent', () => {
  let component: ViewAbstractLineElementComponent;
  let fixture: ComponentFixture<ViewAbstractLineElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAbstractLineElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAbstractLineElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
