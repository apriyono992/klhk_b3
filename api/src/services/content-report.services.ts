import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.services';
import { subDays, format, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval } from 'date-fns';
import { CategoryType } from '@prisma/client';


@Injectable()
export class ContentReportService {
  constructor(private prisma: PrismaService) {}


  async getSearchTrends(
    period: String,
    groupByField: 'keyword' | 'userId' | 'categoryName',
    startDate?: string,
    endDate?: string
  ) {
    let periodGroupBy: string;

    // Determine how to group based on the period
    switch (period) {
        case 'day':
            periodGroupBy = 'DATE("timestamp")'; // Group by day
            break;
        case 'week':
            periodGroupBy = 'DATE_TRUNC(\'week\', "timestamp")'; // Group by week
            break;
        case 'month':
            periodGroupBy = 'DATE_TRUNC(\'month\', "timestamp")'; // Group by month
            break;
        default:
            throw new Error('Invalid period. Use day, week, or month.');
    }

    // Dynamically define group by clause for keyword, userId, or categoryName
    let groupByClause: string;
    if (groupByField === 'keyword') {
        groupByClause = '"keyword"';
    } else if (groupByField === 'userId') {
        groupByClause = '"userId"';
    } else if (groupByField === 'categoryName') {
        groupByClause = 'UNNEST("categoryNames")'; // Flatten the categoryNames array
    } else {
        throw new Error('Invalid groupByField. Use keyword, userId, or categoryName.');
    }

    // Add where clause for filtering by date range
    const whereClause = `
      WHERE "timestamp" >= ${startDate ? `'${startDate}'` : `'1970-01-01'`}
      AND "timestamp" <= ${endDate ? `'${endDate}'` : 'NOW()'}
    `;

    const trends = await this.prisma.$queryRawUnsafe(`
      SELECT 
        ${groupByClause} AS group_by_value,
        ${periodGroupBy} AS period,
        COUNT(*) AS count
      FROM "SearchMetric"
      ${whereClause}
      GROUP BY group_by_value, period
      ORDER BY period ASC;
    `);

    return trends;
  }

  async getViewsReport(
    startDate: string,
    endDate: string,
    contentType?: 'news' | 'article' | 'info' | 'companyDocument',
    groupingType?: string
  ) {
    const whereClause = {
      viewedAt: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    };
    if (contentType) {
      whereClause['contentType'] = contentType;
    }
  
    // Determine grouping format and range
    let dateRange: Date[] = [];
    let dateFormat: string;
    if (groupingType === 'day') {
      dateRange = eachDayOfInterval({ start: new Date(startDate), end: new Date(endDate) });
      dateFormat = 'yyyy-MM-dd';
    } else if (groupingType === 'week') {
      dateRange = eachWeekOfInterval({ start: new Date(startDate), end: new Date(endDate) });
      dateFormat = "'Week' I yyyy"; // Week number and year format
    } else if (groupingType === 'month') {
      dateRange = eachMonthOfInterval({ start: new Date(startDate), end: new Date(endDate) });
      dateFormat = 'yyyy-MM'; // Monthly format
    } else {
      dateRange = eachDayOfInterval({ start: new Date(startDate), end: new Date(endDate) }); // Default to daily
      dateFormat = 'yyyy-MM-dd';
    }
  
    // Fetch actual results from the database
    const result = await this.prisma.contentViewLog.groupBy({
      by: ['viewedAt'],
      where: whereClause,
      _count: {
        _all: true,
      },
    });
  
    // Map the results to the correct format (grouped by the selected period)
    const formattedResult = result.map((item) => ({
      period: format(item.viewedAt, dateFormat),
      views: item._count._all,
    }));
  
    // Fill missing dates/weeks/months with count 0
    const finalResult = dateRange.map((date) => {
      const period = format(date, dateFormat);
      const foundItem = formattedResult.find((item) => item.period === period);
      return {
        period,
        views: foundItem ? foundItem.views : 0, // If no data for this period, return 0
      };
    });
  
    return finalResult;
  }
  
  async getMostViewedContent(
    limit: number = 10,
    startDate?: string,
    endDate?: string,
    contentType?: CategoryType,
    groupingType?: string
  ) {
    // Default date range to cover all records if not provided
    const whereClause: any = {};
    
    if (startDate && endDate) {
      whereClause.viewedAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }
  
    if (contentType) {
      whereClause.contentType = contentType.toString();
    }
  
    // Determine grouping format based on period
    let groupByField: any;
    if (groupingType === 'day') {
      groupByField = { day: { viewedAt: true } };
    } else if (groupingType === 'week') {
      groupByField = { week: { viewedAt: true } };
    } else if (groupingType === 'month') {
      groupByField = { month: { viewedAt: true } };
    } else {
      groupByField = { date: { viewedAt: true } }; // Default grouping by date
    }
  
    // Fetch the most viewed content items
    const result = await this.prisma.contentViewLog.groupBy({
      by: ['contentId', 'contentType'],
      where: whereClause,
      _count: {
        viewedAt: true,
      },
      orderBy: {
        _count: {
          viewedAt: 'desc',
        },
      },
      take: limit || 10, // Limit results to top 'limit' most viewed
    });
  
    // Fetch the content details for each contentId
    const detailedResults = await Promise.all(
      result.map(async (item) => {
        let content;
        switch (item.contentType) {
          case 'news':
            content = await this.prisma.news.findUnique({
              where: { id: item.contentId },
              select: { title: true, slug: true, createdAt: true, updatedAt: true },
            });
            break;
          case 'article':
            content = await this.prisma.article.findUnique({
              where: { id: item.contentId },
              select: { title: true, slug: true, createdAt: true, updatedAt: true },
            });
            break;
          case 'info':
            content = await this.prisma.info.findUnique({
              where: { id: item.contentId },
              select: { title: true, slug: true, createdAt: true, updatedAt: true },
            });
            break;
          case 'companyDocument':
            content = await this.prisma.companyDocument.findUnique({
              where: { id: item.contentId },
              select: { title: true, slug: true, createdAt: true, updatedAt: true },
            });
            break;
        }
  
        return {
          ...item,
          content, // Include the content details
          views: item._count.viewedAt, // Include view count
        };
      })
    );
  
    return detailedResults;
  }
}