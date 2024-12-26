import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Report } from './report.entity';
import { User } from '../users/user.entity';
import { CreateReportDto } from './dtos/create-report';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}

  create(body: CreateReportDto, user: User) {
    const report = this.reportRepository.create(body);
    report.user = user;
    return this.reportRepository.save(report);
  }

  findOneOfUser(reportId: number, userId: number) {
    return this.reportRepository.findOne({
      where: {
        id: reportId,
        user: { id: userId },
      },
      relations: ['user'],
    });
  }
}
