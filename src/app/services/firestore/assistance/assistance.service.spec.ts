import { TestBed } from '@angular/core/testing';

import { AssistanceService } from './assistance.service';

describe('AssistanceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AssistanceService = TestBed.get(AssistanceService);
    expect(service).toBeTruthy();
  });
});
