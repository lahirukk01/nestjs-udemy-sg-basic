import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CurrentUser } from '../decorators/current-user.decorator';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';
import { User } from '../users/user.entity';
import { CreateReportDto } from './dtos/create-report';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ReportResponseDto } from './dtos/report-response';

@Controller('reports')
@UseInterceptors(CurrentUserInterceptor)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @Serialize(ReportResponseDto)
  async createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    const report = await this.reportsService.create(body, user);
    return { report };
  }

  @Get(':id')
  @Serialize(ReportResponseDto)
  async getReport(
    @Param('id', ParseIntPipe) reportId: number,
    @CurrentUser() user: User,
  ) {
    const report = await this.reportsService.findOneOfUser(reportId, user.id);

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    return { report };
  }
}
