import { Module } from '@nestjs/common';
import { TaskScheduleService } from './task-schedule.service';
@Module({
  providers: [TaskScheduleService],
})
export class TaskScheduleModule {}
