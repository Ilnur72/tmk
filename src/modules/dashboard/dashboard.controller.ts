import { Controller, Get, Render } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @Render('dashboard/index')
  getDashboard() {
    return {
      title: 'REGION - Dashboard',
      facilities: this.dashboardService.getFacilities(),
    };
  }
}

@Controller()
export class AppController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @Render('dashboard/index')
  getIndex() {
    return {
      title: 'REGION - Dashboard',
      facilities: this.dashboardService.getFacilities(),
    };
  }
}
