import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../services/prisma.services';

@Injectable()
export class CategoriesValidationPipe implements PipeTransform {
  constructor(private readonly prisma: PrismaService) {}

  async transform(value: any) {
    try {
      value.categories = Array.isArray(value.categories) ? value.categories : value.categories ? value.categories.split(',').map(item => item.trim()) : [];
      console.log(value.categories);
        if (value.categories == undefined || !Array.isArray(value.categories) || value.categories.length === 0) {
          throw new BadRequestException('Categories cannot be empty.');
        }

        const existingCategories = await this.prisma.category.findMany({
          where: { id: { in: value.categories } },
          select: { id: true },
        });

        const existingCategoryIds = existingCategories.map(category => category.id);
        const missingCategoryIds = value.categories.filter(id => !existingCategoryIds.includes(id));

        if (missingCategoryIds.length > 0) {
          throw new BadRequestException(`The following category IDs do not exist: ${missingCategoryIds.join(', ')}`);
        }

      return value;
    } catch (error) {
      console.error('Validation error:', error);
      throw error; // Ensure the exception is rethrown to be caught by the filter
    }
  }
}
