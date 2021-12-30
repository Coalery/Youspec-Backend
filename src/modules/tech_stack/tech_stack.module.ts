import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechStackController } from './tech_stack.controller';
import { TechStack } from './tech_stack.entity';
import { TechStackService } from './tech_stack.service';

@Module({
  imports: [TypeOrmModule.forFeature([TechStack])],
  controllers: [TechStackController],
  providers: [TechStackService],
  exports: [TechStackService],
})
export class TechStackModule {}
