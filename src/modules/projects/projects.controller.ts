import { Controller, Get, Render } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // @Get()
  // @Render('projects')
  // async getHome() {
  //   const locations = await this.projectsService.getAll();
  //   return {
  //     locations: JSON.stringify(locations),
  //     parsedLocations: locations,
  //   };
  // }

  @Get()
  @Render('projects/map')
  root() {
    const projects = this.projectsService.getProjects();
    return {
      projects,
    };
  }
}
