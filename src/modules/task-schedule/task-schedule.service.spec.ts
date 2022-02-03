import { Test, TestingModule } from '@nestjs/testing';
import { TaskScheduleService } from './task-schedule.service';

describe('TaskScheduleService', () => {
  let service: TaskScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskScheduleService],
    }).compile();

    service = module.get<TaskScheduleService>(TaskScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
