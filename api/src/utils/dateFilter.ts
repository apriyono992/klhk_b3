import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { DateFilterDto } from 'src/models/dateFilterDto';

export const DateFilter = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext): Promise<DateFilterDto> => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;

    // Convert query parameters into DateRangeDto class
    const dateRangeDto = plainToClass(DateFilterDto, query);

    // Validate the DTO
    const errors = await validate(dateRangeDto);
    if (errors.length > 0) {
        const errorMessages = errors.map(err => Object.values(err.constraints)).join(', ');
        throw new BadRequestException(`Validation failed: ${errorMessages}`);
    }

    return dateRangeDto;
  },
);
