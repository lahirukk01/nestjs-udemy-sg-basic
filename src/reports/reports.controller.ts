import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User, UserRole } from '../users/user.entity';
import { CreateReportDto } from './dtos/create-report';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ReportResponseDto } from './dtos/report-response';
import { GetEstimateDto } from './dtos/get-estimate';
import { Roles } from '../decorators/roles.decorator';
import { ApproveReportDto } from './dtos/approve-report';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @Serialize(ReportResponseDto)
  @Roles(UserRole.OWNER)
  async createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    const report = await this.reportsService.create(body, user);
    return { report };
  }

  @Get('estimate')
  @Roles(UserRole.ALL)
  async getEstimate(@Query() queryParams: GetEstimateDto) {
    const estimate = await this.reportsService.createEstimate(queryParams);
    return { estimate };
  }

  @Get(':id')
  @Serialize(ReportResponseDto)
  @Roles(UserRole.OWNER)
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

  @Patch(':id')
  @Serialize(ReportResponseDto)
  @Roles(UserRole.ADMIN)
  async changeApproveStatus(
    @Param('id', ParseIntPipe) reportId: number,
    @Body() body: ApproveReportDto,
  ) {
    const report = await this.reportsService.findOneById(reportId);
    const { approved } = body;

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    if (report.approved === approved) {
      throw new BadRequestException('Report already has this approve status');
    }

    const updatedReport = await this.reportsService.changeApproveStatus(
      report,
      approved,
    );

    return { report: updatedReport };
  }
}
