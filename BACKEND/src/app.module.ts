import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeeModule } from './employee/employee.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectModule } from './project/project.module';
import { connect } from 'http2';
import { AppResolver } from './app.resolver';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './common/redis/redis.module';

@Module({
  imports: [UserModule,AuthModule,EmployeeModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloDriver,
    autoSchemaFile: join(process.cwd(), 'src/graphql-schema.gql'),  // Automatically generates schema file
    playground: true,  // Enable GraphQL playground
  }),
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'neel@123',
    database: 'sql_demo',
    entities: ["dist/**/*.entity{.ts,.js}"],
    "logging": true,
    synchronize: true,
    extra:  {
       max: 10, // maximum number of connections
       min: 2,  // minimum number of connections
       idleTimeoutMillis: 60000,  // close idle clients after 30 seconds
    
   }
  }),ProjectModule, UserModule,RedisModule
],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
