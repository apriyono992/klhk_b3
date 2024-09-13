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
    @ApiResponse({ status: 200, description: 'Returns the keyword trends grouped by the specified period' })
    async getKeywordTrends(@Query() trendReportDto: TrendReportDto) {
        const { period, startDate, endDate } = trendReportDto;
        return await this.contentReportService.getSearchTrends(period, 'keyword', startDate, endDate);
    }

    @Get('trends/user')
    @ApiOperation({ summary: 'Get user trends' })
    @ApiQuery({ name: 'period', description: 'Period grouping (day by default, or week, month, year)', required: false })
    @ApiResponse({ status: 200, description: 'Returns the user trends grouped by the specified period' })
    async getUserIdTrends(@Query() trendReportDto: TrendReportDto) {
        const { period, startDate, endDate } = trendReportDto;
        return await this.contentReportService.getSearchTrends(period, 'userId', startDate, endDate);
    }

    @Get('trends/categoryName')
    @ApiOperation({ summary: 'Get category name trends' })
    @ApiQuery({ name: 'period', description: 'Period grouping (day by default, or week, month, year)', required: false })
    @ApiResponse({ status: 200, description: 'Returns the category name trends grouped by the specified period' })
    async getCategoryNameTrends(@Query() trendReportDto: TrendReportDto) {
        const { period, startDate, endDate } = trendReportDto;
        return await this.contentReportService.getSearchTrends(period, 'categoryName', startDate, endDate);
    }

    @Get('/views-report')
    @ApiOperation({ summary: 'Get views report' })
    @ApiQuery({ name: 'period', description: 'Period grouping (day by default, or week, month, year)', required: false })
    @ApiResponse({ status: 200, description: 'Returns the views report grouped by the specified period' })
    async getViewsReport(@Query() trendReportDto: TrendReportDto, @Query('type') contentType?: 'news' | 'article' | 'info' | 'companyDocument') {
        const { period, startDate, endDate } = trendReportDto;
        return this.contentReportService.getViewsReport(startDate, endDate, contentType, period);
    }

    @Get('/most-viewed-content')
    @ApiOperation({ summary: 'Get most viewed content' })
    @ApiQuery({ name: 'limit', description: 'Limit the number of results', required: false })
    @ApiResponse({ status: 200, description: 'Returns the most viewed content' })
    async getMostViewedContent(@Query() trendReportDto: TrendReportDto, @Query('type') contentType?: CategoryType, 
    @Query('limit') limit: number = 10) {
      const { period, startDate, endDate } = trendReportDto;
      return this.contentReportService.getMostViewedContent(limit, startDate, endDate, contentType, period);
    }
}
