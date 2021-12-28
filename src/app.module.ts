import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import config from './config';
import { CatchAllFilter } from './filters/catch_all.filter';
import { HttpExceptionFilter } from './filters/http_exception.filter';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { ProjectModule } from './modules/project/project.module';
import { TechStackModule } from './modules/tech_stack/tech_stack.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRoot(),
    ProjectModule,
    TechStackModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: CatchAllFilter },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
  ],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
