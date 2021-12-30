import { IsNotEmpty } from 'class-validator';
import { TechStack } from '../tech_stack/tech_stack.entity';

export class CreateProjectDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  makers: string;

  techStacks: TechStack[];
}
