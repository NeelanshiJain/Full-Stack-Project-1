import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProjectService } from './project.service';

import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { Project } from './entities/project.entity';

@Resolver(() => Project)
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) { }

  @Mutation(() => Project)
  createProject(@Args('project') project: CreateProjectInput) {
    return this.projectService.create(project);
  }

  @Query(() => [Project], { name: 'getAllProjects' })
  findAll() {
    return this.projectService.findAll();
  }

  @Query(() => Project, { name: 'project' })
  findOne(@Args('id') id: string) {
    return this.projectService.findOne(id);
  }

}
