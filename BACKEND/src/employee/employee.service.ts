


import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import {  DataSource } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { EmployeeCreateDTO } from './dto/create-employee.input';
import { Project } from 'src/project/entities/project.entity';
import { ProjectService } from 'src/project/project.service';
import { EmployeeUpdateDTO } from './dto/update-employee.input';
import { EmployeeUpdateLog } from './entities/employee-update-log.entity';
import { RedisService } from 'src/common/redis/redis.service';

@Injectable()
export class EmployeeService {

    private readonly logger = new Logger(EmployeeService.name);
    
    constructor(@InjectRepository(Employee) private employeeRepository: Repository<Employee>,
    @InjectRepository(EmployeeUpdateLog) private employeeUpdateLogRepository: Repository<EmployeeUpdateLog>,
    private projectService: ProjectService, @InjectDataSource() private dataSource: DataSource,private readonly redisService: RedisService) {

    }

    async findAllEmployees(): Promise<Employee[]> {
        const cacheKey = 'allEmployees';
        const cachedEmployees = await this.redisService.get(cacheKey);
    
        if (cachedEmployees) {
            console.log("FETCHING FROM REDIS")
          return JSON.parse(cachedEmployees);
        }
    
        this.logger.debug('Acquiring database connection...');
        const query = `
            SELECT *
            FROM employee
        `;
        const result = await this.dataSource.query(query);
        console.log("FETCHING FROM DB")
        let employees=await this.employeeRepository.find()
        // Introducing a delay of 5 seconds (you can adjust this as needed)
        this.logger.debug('Result...');
        //await new Promise(resolve => setTimeout(resolve, 50000));

        this.logger.debug('Releasing database connection...');
        
        await this.redisService.set(cacheKey, JSON.stringify(result), 36000); // Cache for 1 hour
        return employees;
    }

    async findEmployeeById(id : number): Promise<Employee> {

        const cacheKey = `employee_${id}`;
        const cachedEmployee = await this.redisService.get(cacheKey);

        if (cachedEmployee) {
        return JSON.parse(cachedEmployee);
        }

        
        this.logger.debug('Acquiring database connection...');
        let employee=await this.employeeRepository.findOne({where:{id:id}})
        this.logger.debug('Releasing database connection...');
         return employee;
    }
    
    async addEmployee(employee: EmployeeCreateDTO): Promise<string> {
        let emp:Employee=new Employee();
        emp.firstName=employee.firstName;
        emp.lastName=employee.lastName;
        emp.designation=employee.designation;
        emp.city=employee.city;
        emp.projectId=employee.projectId;
        await this.employeeRepository.save(emp)
        await this.redisService.del('allEmployees'); 
        return "employee has been succefully added!!";

    }

    async updateEmployee(employee: EmployeeUpdateDTO, userId: number): Promise<string> {
        let emp:Employee=await this.employeeRepository.findOne({where:{id:employee.id}})
        const changes = {};

        for (const key of Object.keys(employee)) {
            if (employee[key] !== undefined && emp[key] !== employee[key]) {
                changes[key] = { old: emp[key], new: employee[key] };
                emp[key] = employee[key];
               
            }
        }
        await this.employeeRepository.save(emp)
        const cacheKey = `employee_${employee.id}`;
        await this.redisService.set(cacheKey, JSON.stringify(emp), 3600); // Update cache
        await this.redisService.del('allEmployees');
        
        // Log the update
        const log = new EmployeeUpdateLog();
        log.employeeId = employee.id;
        log.updatedAt = new Date();
        log.updatedBy = userId;
        log.changes = changes;
        await this.employeeUpdateLogRepository.save(log);
        return "employee has been succefully updated!!";

    }

    async deleteEmployee(id : number): Promise<string> {
        await this.employeeRepository.delete(id)
        const cacheKey = `employee_${id}`;
        await this.redisService.del(cacheKey);
        await this.redisService.del('allEmployees');
        return "Employee has been deleted";
    }

    async getProject(id: string): Promise<Project> {
        return this.projectService.findOne(id)
    }

    
}
