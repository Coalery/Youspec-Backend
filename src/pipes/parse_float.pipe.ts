import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseFloatPipe implements PipeTransform<string> {
  async transform(value: string, metadata: ArgumentMetadata): Promise<number> {
    const isNumeric =
      ['string', 'number'].includes(typeof value) &&
      !isNaN(parseFloat(value)) &&
      isFinite(value as any);
    if (!isNumeric) {
      throw new HttpException('Float number expected.', HttpStatus.BAD_REQUEST);
    }
    return parseFloat(value);
  }
}
