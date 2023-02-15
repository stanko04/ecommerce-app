import { TestBed } from '@angular/core/testing';

import { DatesFormService } from './dates-form.service';

describe('DatesFormService', () => {
  let service: DatesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatesFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
