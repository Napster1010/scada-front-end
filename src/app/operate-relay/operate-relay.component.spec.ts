import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperateRelayComponent } from './operate-relay.component';

describe('OperateRelayComponent', () => {
  let component: OperateRelayComponent;
  let fixture: ComponentFixture<OperateRelayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperateRelayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperateRelayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
