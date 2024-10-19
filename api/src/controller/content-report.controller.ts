import { Query, Get, Controller } from '@nestjs/common';
import { TrendReportDto } from '../models/searchTrendDto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ContentReportService } from 'src/services/content-report.services';
import { CategoryType } from '@prisma/client';

@ApiTags('Content Report')
@Controller('report/content')
export class ContentReportController {
  constructor(private readonly contentReportService: ContentReportService) {}

  @Get('trends/keyword')
  @ApiOperation({ summary: 'Get keyword trends' })
  @ApiQuery({ name: 'period', description: 'Period grouping (day by default, or week, month, year)', required: false })
  @ApiResponse({
    status: 200,
    description: 'Returns the keyword trends grouped by the specified period',
    schema: {
      example: [
        {
          period: '2024-10-19',
          group_by_value: 'environment',
          count: 25
        },
        {
          period: '2024-10-18',
          group_by_value: 'pollution',
          count: 30
        },
      ],
    },
  })
  async getKeywordTrends(@Query() trendReportDto: TrendReportDto) {
    const { period, startDate, endDate } = trendReportDto;
    return await this.contentReportService.getSearchTrends(period, 'keyword', startDate, endDate);
  }

  @Get('trends/user')
  @ApiOperation({ summary: 'Get user trends' })
  @ApiQuery({ name: 'period', description: 'Period grouping (day by default, or week, month, year)', required: false })
  @ApiResponse({
    status: 200,
    description: 'Returns the user trends grouped by the specified period',
    schema: {
      example: [
        {
          period: '2024-10-19',
          group_by_value: 'user123',
          count: 40
        },
        {
          period: '2024-10-18',
          group_by_value: 'user456',
          count: 55
        },
      ],
    },
  })
  async getUserIdTrends(@Query() trendReportDto: TrendReportDto) {
    const { period, startDate, endDate } = trendReportDto;
    return await this.contentReportService.getSearchTrends(period, 'userId', startDate, endDate);
  }

  @Get('trends/categoryName')
  @ApiOperation({ summary: 'Get category name trends' })
  @ApiQuery({ name: 'period', description: 'Period grouping (day by default, or week, month, year)', required: false })
  @ApiResponse({
    status: 200,
    description: 'Returns the category name trends grouped by the specified period',
    schema: {
      example: [
        {
          period: '2024-10-19',
          group_by_value: 'Technology',
          count: 15
        },
        {
          period: '2024-10-18',
          group_by_value: 'Health',
          count: 20
        },
      ],
    },
  })
  async getCategoryNameTrends(@Query() trendReportDto: TrendReportDto) {
    const { period, startDate, endDate } = trendReportDto;
    return await this.contentReportService.getSearchTrends(period, 'categoryName', startDate, endDate);
  }

  @Get('/views-report')
  @ApiOperation({ summary: 'Get views report' })
  @ApiQuery({ name: 'period', description: 'Period grouping (day by default, or week, month, year)', required: false })
  @ApiResponse({
    status: 200,
    description: 'Returns the views report grouped by the specified period',
    schema: {
      example: [
        {
          period: '2024-10-19',
          views: 150
        },
        {
          period: '2024-10-18',
          views: 200
        },
      ],
    },
  })
  async getViewsReport(
    @Query() trendReportDto: TrendReportDto,
    @Query('type') contentType?: 'news' | 'article' | 'info' | 'companyDocument'
  ) {
    const { period, startDate, endDate } = trendReportDto;
    return this.contentReportService.getViewsReport(startDate, endDate, contentType, period);
  }

  @Get('/most-viewed-content')
  @ApiOperation({ summary: 'Get most viewed content' })
  @ApiQuery({ name: 'limit', description: 'Limit the number of results', required: false })
  @ApiResponse({
    status: 200,
    description: 'Returns the most viewed content',
    schema: {
      example: [
        {
          contentId: 'article123',
          contentType: 'article',
          content: {
            title: 'Understanding Climate Change',
            slug: 'understanding-climate-change',
            createdAt: '2024-09-20T10:00:00Z',
            updatedAt: '2024-10-15T10:00:00Z',
          },
          views: 120,
        },
        {
          contentId: 'news456',
          contentType: 'news',
          content: {
            title: 'New Environmental Policies in 2024',
            slug: 'new-environmental-policies-2024',
            createdAt: '2024-10-01T10:00:00Z',
            updatedAt: '2024-10-18T10:00:00Z',
          },
          views: 85,
        },
      ],
    },
  })
  async getMostViewedContent(
    @Query() trendReportDto: TrendReportDto,
    @Query('type') contentType?: CategoryType,
    @Query('limit') limit: number = 10
  ) {
    const { period, startDate, endDate } = trendReportDto;
    return this.contentReportService.getMostViewedContent(limit, startDate, endDate, contentType, period);
  }
}
