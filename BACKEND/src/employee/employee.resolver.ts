import { Args, Context, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Employee } from './entities/employee.entity';
import { EmployeeService } from './employee.service';
import { EmployeeCreateDTO } from './dto/create-employee.input';
import { Project } from 'src/project/entities/project.entity';
import { RoleGuard, Roles } from 'src/auth/role.guards';
import { JwtGuard } from 'src/auth/jwt.guards';
import { UseGuards } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { EmployeeUpdateDTO } from './dto/update-employee.input';

@Resolver(()=>Employee)

export class EmployeeResolver {
    constructor(private readonly employeeService: EmployeeService) { }

    @Query(() => [Employee],{ name: "getemployees" })
    getAllEmployees() {
        return this.employeeService.findAllEmployees();
    }
    
    @Query(() => Employee,{ name: "getemployeeById" })
    getEmployeeById(@Args({name:"employeeId",type:()=>Int}) id: number) {
        return this.employeeService.findEmployeeById(id);
    }

    @Mutation(() => String, { name: "deleteEmployee" })
    @UseGuards(JwtGuard,new RoleGuard(Roles.ADMIN))
    deleteEmployeeById(@Args({name:"employeeId",type:()=>Int}) id: number) {
        return this.employeeService.deleteEmployee(id)
    }


    @Mutation(() => String, { name: "addEmployee" })
    @UseGuards(JwtGuard,new RoleGuard(Roles.ADMIN))
    addEmployee(@Args('employeeInput') employee: EmployeeCreateDTO) {
        return this.employeeService.addEmployee(employee)
    }

    @Mutation(() => String, { name: "updateEmployee" })
    @UseGuards(JwtGuard,new RoleGuard(Roles.ADMIN))
    updateEmployee(@Args('employeeInput') employee: EmployeeUpdateDTO, @Context("user") user:User) {
        return this.employeeService.updateEmployee(employee,user.id)
    }

    @ResolveField(() => Project)
    project(@Parent() employee: Employee) {
        return this.employeeService.getProject(employee.projectId)
    }

}
