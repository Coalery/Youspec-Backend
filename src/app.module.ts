import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import config from './config';
import { CatchAllFilter } from './filters/catch_all.filter';
import { HttpExceptionFilter } from './filters/http_exception.filter';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { PortfolioModule } from './modules/portfolio/portfolio.module';
import { ProjectModule } from './modules/project/project.module';
import { TechStackModule } from './modules/tech_stack/tech_stack.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRoot(),
    ProjectModule,
    TechStackModule,
    PortfolioModule,
    UserModule,
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
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*')
      .apply(AuthMiddleware)
      .exclude({
        path: 'user',
        method: RequestMethod.POST,
      })
      .forRoutes('*');
  }
}
