import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Report } from './report.entity';
import { User } from '../users/user.entity';
import { CreateReportDto } from './dtos/create-report';
import { GetEstimateDto } from './dtos/get-estimate';

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

  findOneById(id: number) {
    return this.reportRepository.findOneBy({ id });
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

  changeApproveStatus(report: Report, approved: boolean) {
    report.approved = approved;
    return this.reportRepository.save(report);
  }

  createEstimate(queryParams: GetEstimateDto) {
    const { price, make, model, miles, lat, lng } = queryParams;

    return this.reportRepository
      .createQueryBuilder('report')
      .select('AVG(report.price)', 'price')
      .where('report.make = :make', { make })
      .andWhere('report.model = :model', { model })
      .andWhere('report.miles < :miles', { miles })
      .andWhere('report.price < :price', { price })
      .andWhere('ABS(report.lat - :lat) < 5', { lat })
      .andWhere('ABS(report.lng - :lng) < 5', { lng })
      .andWhere('approved = true')
      .orderBy('ABS(report.miles - :miles)', 'ASC')
      .setParameters({ miles })
      .limit(3)
      .getRawOne();
  }
}
