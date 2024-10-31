import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.services';
import { CategoryType, Prisma, Status } from '@prisma/client';
import { nanoid } from 'nanoid';
import { CreateNewsDto } from '../models/createNewsDto';
import { CreateArticleDto } from '../models/createArticleDto';
import { CreateInfoDto } from '../models/createInfoDto';
import { CreateCompanyDocumentDto } from '../models/createCompanyDocumentDto';
import { CreateCategoryDto } from '../models/createCategoyDto';
import { SearchContentDto } from '../models/searchCotentDto';
import { CategoriesValidationPipe } from 'src/validators/category.pipe';
import { CreateEventDto } from 'src/models/createEventDto';
import { SearchEventDto } from 'src/models/searchEventDto';
import axios from 'axios';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UploadResult } from 'src/models/uploadResult';


@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService,
    private categoriesValidationPipe: CategoriesValidationPipe) {}

  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  async createCategory(data: CreateCategoryDto) {
    let slug = data.slug || this.generateSlug(data.name);

    // Ensure unique slug
    const existingCategoryBySlug = await this.prisma.category.findUnique({
        where: { slug },
    });
    if (existingCategoryBySlug) {
        slug = `${slug}-${nanoid(6)}`; // Add random string if slug already exists
    }

    // Check if a category with the same name and type already exists
    const existingCategoryByNameAndType = await this.prisma.category.findFirst({
        where: {
            name: data.name,
            type: data.type,
        },
    });

    if (existingCategoryByNameAndType) {
        throw new BadRequestException(
            `Category with name "${data.name}" and type "${data.type}" already exists.`,
        );
    }

    try {
        return await this.prisma.category.create({
            data: {
                author: data.author,
                name: data.name,
                slug: slug,
                type: data.type,
            },
        });
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
            throw new BadRequestException('A category with the same unique fields already exists.');
        }
        throw error; // Rethrow the error if it's not a unique constraint violation
    }
  }

  async createUniqueSlug(title: string, modelName: string): Promise<string> {
    let slug = this.generateSlug(title);
    const existingItem = await this.prisma[modelName].findUnique({ where: { slug } });

    if (existingItem) {
      slug = `${slug}-${nanoid(6)}`;
    }

    return slug;
  }

  async createNews(data: CreateNewsDto) {
    data = await this.categoriesValidationPipe.transform(data);
    const slug = await this.createUniqueSlug(data.title, 'news');
    const attachmentsData = data.attachments?.map(attachment => ({
      fileUrl: attachment?.fileUrl,
      filePath: attachment?.filePath,
    })) || [];

    const categories = Array.isArray(data.categories) ? data.categories : data.categories ? [data.categories] : [];

    const newsData: Prisma.NewsCreateInput = {
      title: data.title,
      author: data.author,
      createdById: data.createdById,
      content: data.content,
      description: data.content,
      slug,
      status: data.status || Status.DRAFT,
      categories: {
        connect: categories?.map(id => ({ id })) || [],
      },
      photos: {
        create: attachmentsData?.map(x => ({
          author: data.author,
          url:x.filePath,
          status: data.status
        })),
      },
    };
    return this.prisma.news.create({
      data: newsData,
    });
  }

  async createArticle(data: CreateArticleDto) {
    data = await this.categoriesValidationPipe.transform(data);
    const slug = await this.createUniqueSlug(data.title, 'article');
    const attachmentsData = data.attachments?.map(attachment => ({
      fileUrl: attachment?.fileUrl,
      filePath: attachment?.filePath,
    })) || [];

    const categories = Array.isArray(data.categories) ? data.categories : data.categories ? [data.categories] : [];

    const articleData: Prisma.ArticleCreateInput = {
      title: data.title,
      content: data.content,
      description: data.content,
      author: data.author,
      createdById: data.createdById,
      slug,
      status: data.status || Status.DRAFT,
      categories: {
        connect: categories?.map(id => ({ id })) || [],
      },
      photos: {
        create: attachmentsData?.map(x => ({
          author: data.author,
          url:x.filePath,
          status: data.status 
        })),
      },
    };
    return this.prisma.article.create({
      data: articleData,
    });
  }

  async createInfo(data: CreateInfoDto) {
    data = await this.categoriesValidationPipe.transform(data);
    const slug = await this.createUniqueSlug(data.title, 'info');
    const attachmentsData = data.attachments?.map(attachment => ({
      fileUrl: attachment?.fileUrl,
      filePath: attachment?.filePath,
    })) || [];

    const categories = Array.isArray(data.categories) ? data.categories : data.categories ? [data.categories] : [];

    const infoData: Prisma.InfoCreateInput = {
      title: data.title,
      description: data.description,
      author: data.author,
      slug,
      status: data.status || Status.DRAFT,
      categories: {
        connect: categories?.map(id => ({ id })) || [],
      },
      createdById: data.createdById,
      photos: {
        create: attachmentsData?.map(x => ({
          author: data.author,
          url:x.filePath,
          status: data.status || Status.DRAFT
        })),
      },
    };
    return this.prisma.info.create({
      data: infoData,
    });
  }

  async createCompanyDocument(data: CreateCompanyDocumentDto) {
    data = await this.categoriesValidationPipe.transform(data);
    const slug = await this.createUniqueSlug(data.title, 'companyDocument');
    const attachmentsData = data.attachments?.map(attachment => ({
      fileUrl: attachment?.fileUrl,
      filePath: attachment?.filePath,
    })) || [];

    const categories = Array.isArray(data.categories) ? data.categories : data.categories ? [data.categories] : [];

    const documentData: Prisma.CompanyDocumentCreateInput = {
      title: data.title,
      author: data.author,
      createdById: data.createdById,
      slug,
      description: data.description,
      documentUrl: data.title,
      status: data.status || Status.DRAFT,
      attachments: {
        create: attachmentsData?.map(x => ({
        author : data.author,
        documentPath : x.filePath,
        documentUrl: x.fileUrl
        })),
      },
      categories: {
        connect: categories?.map(id => ({ id })) || [],
      },
    };
    return this.prisma.companyDocument.create({
      data: documentData,
    });
  }

  async createEvent(createEventDto: CreateEventDto) {
    
    createEventDto = await this.categoriesValidationPipe.transform(createEventDto);
    const slug = await this.createUniqueSlug(createEventDto.title, 'event');
    const { latitude, longitude } = createEventDto;

    // Reverse geocode to get city, province, country
    const locationDetails = await this.getLocationDetails(latitude, longitude);

    const event = await this.prisma.event.create({
      data: {
        title: createEventDto.title,
        description: createEventDto.description,
        startDate: new Date(createEventDto.startDate),
        endDate: new Date(createEventDto.endDate),
        latitude,
        longitude,
        slug: slug,
        city: locationDetails.city,
        province: locationDetails.province,
        country: locationDetails.country,
        createdById: createEventDto.createdById,
        status: createEventDto.status,
        author: createEventDto.author,
        categories: {
          connect: createEventDto.categories?.map((id) => ({ id })),
        },
      },
    });

    // Handle attachments if any
    if (createEventDto.documents) {
      for (const file of createEventDto.documents) {
        await this.prisma.attachment.create({
          data: {
            documentUrl: file.fileUrl,
            documentPath: file.filePath,
            eventId: event.id,
            author: createEventDto.author,
          },
        });
      }
    }

    // Handle attachments if any
    if (createEventDto.photos) {
      for (const file of createEventDto.photos) {
        await this.prisma.photo.create({
          data: {
            url: file.fileUrl,
            eventId: event.id,
            author: createEventDto.author,
          },
        });
      }
    }
    return event;
  }

  async getNewsBySlug(slug: string) {
    const news = await this.prisma.news.findUnique({ where: { slug, status: Status.PUBLISHED }, include: { categories: true, photos: true } });
    if (!news) {
      throw new NotFoundException(`News with slug ${slug} not found`);
    }
    // Log the view event in the log table
    await this.logViewEvent(news.id, CategoryType.NEWS);
    return { ...news, photoUrls: news.photos.map(photo => `${process.env.API_BASE_URL}/${photo.url}`) };
  }

  async getArticleBySlug(slug: string) {
    const article = await this.prisma.article.findUnique({ where: { slug, status: Status.PUBLISHED }, include: { categories: true, photos: true } });
    if (!article) {
      throw new NotFoundException(`Article with slug ${slug} not found`);
    }
    
    // Log the view event in the log table
    await this.logViewEvent(article.id, CategoryType.ARTICLE);
    return { ...article, photoUrls: article.photos.map(photo => `${process.env.API_BASE_URL}/${photo.url}`) };
  }

  async getInfoBySlug(slug: string) {
    const info = await this.prisma.info.findUnique({ where: { slug, status: Status.PUBLISHED }, include: { categories: true, photos: true } });
    if (!info) {
      throw new NotFoundException(`Info with slug ${slug} not found`);
    }
    
    // Log the view event in the log table
    await this.logViewEvent(info.id, CategoryType.INFO);
    return { ...info, photoUrls: info.photos.map(photo => `${process.env.API_BASE_URL}/${photo.url}`) };
  }

  async getCompanyDocumentBySlug(slug: string) {
    const document = await this.prisma.companyDocument.findUnique({ where: { slug, status: Status.PUBLISHED }, include: { categories: true, attachments: true } });
    if (!document) {
      throw new NotFoundException(`Company document with slug ${slug} not found`);
    }
    
    // Log the view event in the log table
    await this.logViewEvent(document.id, CategoryType.DOCUMENT);
    return { ...document, attachmentsUrl: document.attachments.map(attachment => ({ fileUrl: attachment.documentUrl, filePath: attachment.documentPath })) };
  }

  async getEventBySlug(slug: string) {
    const event = await this.prisma.event.findUnique({ where: { slug, status: Status.PUBLISHED }, include: { categories: true, attachments: true, photos: true } });
    if (!event) {
      throw new NotFoundException(`Event with slug ${slug} not found`);
    }
    
    // Log the view event in the log table
    await this.logViewEvent(event.id, CategoryType.EVENT);
    return { ...event, attachments: event.attachments.map(attachment => `${process.env.API_BASE_URL}/${attachment.documentPath}`), photoUrls: event.photos.map(photo => `${process.env.API_BASE_URL}/${photo.url}`) };
  }

  async searchContent(params: SearchContentDto) {
    const { name, categoryId, categoryName, status, type, startDate, endDate, page = 1, limit = 10, sortOrder = 'desc', sortBy = 'createdAt'} = params;

    const skip = (page - 1) * limit;
    const orderBy = { [sortBy]: sortOrder };

    // Base conditions for all types, defined as a basic Prisma condition
    const baseConditions: Prisma.NewsWhereInput = {};

    if (name) {
        baseConditions.title = { contains: name, mode: 'insensitive' };
    }

    if (categoryId) {
        baseConditions.categories = { some: { id: categoryId } };
    }

    if (categoryName && categoryName.length > 0) {
      baseConditions.categories = {
        some: {
          name: {
            in: categoryName,
            mode: 'insensitive',
          },
        },
      };
    }

    if (startDate || endDate) {
        baseConditions.createdAt = {
            gte: startDate ? new Date(startDate) : undefined,
            lte: endDate ? new Date(endDate) : undefined,
        };
    }

    if(status){
      baseConditions.status = { equals: status};
    }

    // Initialize results for each type
    let newsResults = [];
    let articleResults = [];
    let infoResults = [];
    let documentResults = [];
    let eventResults = [];

    // Apply search based on type or search all types if no type is specified
    if (!type || type === 'NEWS') {
        newsResults = await this.prisma.news.findMany({
            where: baseConditions as Prisma.NewsWhereInput,
            select: {
                id: true,
                title: true,
                slug: true,
                createdAt: true,
                updatedAt: true,
                description: true,
                photos: true,
                categories: true,
            },
            skip,
            take: limit,
            orderBy,
        });
    }

    if (!type || type === 'ARTICLE') {
        articleResults = await this.prisma.article.findMany({
            where: baseConditions as Prisma.ArticleWhereInput,
            select: {
                id: true,
                title: true,
                slug: true,
                createdAt: true,
                updatedAt: true,
                description: true,             
                photos: true,
                categories: true,
            },
            skip,
            take: limit,
            orderBy,
        });
    }

    if (!type || type === 'INFO') {
        infoResults = await this.prisma.info.findMany({
            where: baseConditions as Prisma.InfoWhereInput,
            select: {
                id: true,
                title: true,
                slug: true,
                createdAt: true,
                updatedAt: true,
                description: true,      
                photos: true,
                categories: true,
            },
            skip,
            take: limit,
            orderBy,
        });
    }

    if (!type || type === 'DOCUMENT') {
        documentResults = await this.prisma.companyDocument.findMany({
            where: baseConditions as Prisma.CompanyDocumentWhereInput,
            select: {
                id: true,
                title: true,
                slug: true,
                createdAt: true,
                updatedAt: true,
                description: true,
                photos: true,
                categories: true,
            },
            skip,
            take: limit,
            orderBy,
        });
    }

    if (!type || type === 'EVENT') {
      eventResults = await this.prisma.event.findMany({
          where: baseConditions as Prisma.EventWhereInput,
          select: {
              id: true,
              title: true,
              slug: true,
              createdAt: true,
              updatedAt: true,
              description: true,
              photos: true,
              attachments:true,
              categories: true,
          },
          skip,
          take: limit,
          orderBy,
      });
  }

    // Count totals for pagination
    const totalNews = type && type !== 'NEWS' ? 0 : await this.prisma.news.count({ where: baseConditions as Prisma.NewsWhereInput });
    const totalArticles = type && type !== 'ARTICLE' ? 0 : await this.prisma.article.count({ where: baseConditions as Prisma.ArticleWhereInput });
    const totalInfos = type && type !== 'INFO' ? 0 : await this.prisma.info.count({ where: baseConditions as Prisma.InfoWhereInput });
    const totalDocuments = type && type !== 'DOCUMENT' ? 0 : await this.prisma.companyDocument.count({ where: baseConditions as Prisma.CompanyDocumentWhereInput });
    const totalEvents = type && type !== 'EVENT' ? 0 : await this.prisma.event.count({ where: baseConditions as Prisma.EventWhereInput });

    return {
        news: newsResults.map(news => ({ ...news, photoUrls: news.photos.map(photo => `${process.env.API_BASE_URL}/${photo.url}`) })),
        articles: articleResults.map(article => ({ ...article, photoUrls: article.photos.map(photo => `${process.env.API_BASE_URL}/${photo.url}`) })),
        infos: infoResults.map(info => ({ ...info, photoUrls: info.photos.map(photo => `${process.env.API_BASE_URL}/${photo.url}`) })),
        documents: documentResults.map(document => ({ ...document, attachmentsUrl: document.attachments.map(attachment => `${process.env.API_BASE_URL}/${attachment.documentPath}`) })),
        event: eventResults.map(event => ({ ...event, 
          attachmentsUrl: event.attachments.map(attachment => `${process.env.API_BASE_URL}/${attachment.documentPath}`), 
          photoUrls: event.photos.map(photo => `${process.env.API_BASE_URL}/${photo.url}`) })),
        pagination: {
            page,
            limit,
            totalNews,
            totalArticles,
            totalInfos,
            totalDocuments,
            totalEvents,
        },
    };
  }

  async searchNews(searchDto: SearchContentDto) {
    const { name, categoryName, startDate, endDate, page = 1, limit = 10, sortOrder = 'desc', sortBy = 'createdAt' } = searchDto;
    searchDto.type = CategoryType.NEWS;

    await this.logSearchMetrics(searchDto);

    const where: Prisma.NewsWhereInput = {};
  
    if (name) {
      where.title = { contains: name, mode: 'insensitive' };
    }
    if (categoryName && categoryName.length > 0) {
      where.categories = {
        some: {
          name: {
            in: categoryName,
            mode: 'insensitive',
          },
        },
      };
    }
    if (startDate) {
      where.createdAt = { gte: new Date(startDate) };
    }
    if (endDate) {
      where.createdAt = { lte: new Date(endDate) };
    }

    where.status = { equals: Status.PUBLISHED }
  
    const news = await this.prisma.news.findMany({
      where,
      include: { photos: true, categories: true },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });
  
    const total = await this.prisma.news.count({ where });
  
    return {
      total,
      page,
      limit,
      data: news.map(news => ({ ...news, photoUrls: news.photos.map(photo => `${process.env.API_BASE_URL}/${photo.url}`) })),
    };
  }
  
  async searchArticles(searchDto: SearchContentDto) {
    const { name, categoryName, startDate, endDate, page = 1, limit = 10, sortOrder = 'desc', sortBy = 'createdAt'} = searchDto;
    searchDto.type = CategoryType.ARTICLE;
    await this.logSearchMetrics(searchDto);

    const where: Prisma.ArticleWhereInput = {};
  
    if (name) {
      where.title = { contains: name, mode: 'insensitive' };
    }
    if (categoryName && categoryName.length > 0) {
      where.categories = {
        some: {
          name: {
            in: categoryName,
            mode: 'insensitive',
          },
        },
      };
    }
    if (startDate) {
      where.createdAt = { gte: new Date(startDate) };
    }
    if (endDate) {
      where.createdAt = { lte: new Date(endDate) };
    }
    
    where.status = { equals: Status.PUBLISHED }

    const articles = await this.prisma.article.findMany({
      where,
      include: { photos: true, categories: true },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });
  
    const total = await this.prisma.article.count({ where });
  
    return {
      total,
      page,
      limit,
      data: articles.map(article => ({ ...article, photoUrls: article.photos.map(photo => `${process.env.API_BASE_URL}/${photo.url}`) })),
    };
  }
  
  async searchInfo(searchDto: SearchContentDto) {
    const { name, categoryName, startDate, endDate, page = 1, limit = 10, sortOrder = 'desc', sortBy = 'createdAt'} = searchDto;
    const where: Prisma.InfoWhereInput = {};
    searchDto.type = CategoryType.INFO;
    await this.logSearchMetrics(searchDto);
    
    if (name) {
      where.title = { contains: name, mode: 'insensitive' };
    }
    if (categoryName && categoryName.length > 0) {
      where.categories = {
        some: {
          name: {
            in: categoryName,
            mode: 'insensitive',
          },
        },
      };
    }
    if (startDate) {
      where.createdAt = { gte: new Date(startDate) };
    }
    if (endDate) {
      where.createdAt = { lte: new Date(endDate) };
    }

    where.status = { equals: Status.PUBLISHED }
  
    const info = await this.prisma.info.findMany({
      where,
      include: { photos: true, categories: true },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });
  
    const total = await this.prisma.info.count({ where });
  
    return {
      total,
      page,
      limit,
      data: info.map(info => ({ ...info, photoUrls: info.photos.map(photo => `${process.env.API_BASE_URL}/${photo.url}`) })),
    };
  }  

  async searchCompanyDocuments(searchDto: SearchContentDto) {
    const { name, categoryName, startDate, endDate, page = 1, limit = 10, sortOrder = 'desc', sortBy = 'createdAt' } = searchDto;
    searchDto.type = CategoryType.DOCUMENT;
    await this.logSearchMetrics(searchDto);

    const where: Prisma.CompanyDocumentWhereInput = {};
  
    if (name) {
      where.title = { contains: name, mode: 'insensitive' };
    }
    if (categoryName && categoryName.length > 0) {
      where.categories = {
        some: {
          name: {
            in: categoryName,
            mode: 'insensitive',
          },
        },
      };
    }
    if (startDate) {
      where.createdAt = { gte: new Date(startDate) };
    }
    if (endDate) {
      where.createdAt = { lte: new Date(endDate) };
    }

    where.status = { equals: Status.PUBLISHED }
  
    const documents = await this.prisma.companyDocument.findMany({
      where,
      include: { attachments: true, categories: true },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });
  
    const total = await this.prisma.companyDocument.count({ where });
  
    return {
      total,
      page,
      limit,
      data: documents.map(document => ({ ...document, attachmentsUrl: document.attachments.map(attachment => `${process.env.API_BASE_URL}/${attachment.documentPath}`) })),
    };
  }  

  async searchEvents(searchEventDto: SearchEventDto) {
    const { title, categoryName, startDate, endDate, page = 1, limit = 10, sortOrder = 'desc', sortBy = 'createdAt' } = searchEventDto;
    await this.logSearchEventMetrics(searchEventDto);
    
    const where: any = {};
    if (title) {
      where.title = { contains: title, mode: 'insensitive' };
    }
    if (categoryName && categoryName.length > 0) {
      where.categories = {
        some: {
          name: {
            in: categoryName,
            mode: 'insensitive',
          },
        },
      };
    }
    if (startDate) {
      where.startDate = { gte: new Date(startDate) };
    }
    if (endDate) {
      where.endDate = { lte: new Date(endDate) };
    }
    
    where.status = { equals: Status.PUBLISHED }

    const events = await this.prisma.event.findMany({
      where,
      include: { categories: true, attachments: true, photos: true },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await this.prisma.event.count({ where });

    return {
      total,
      page,
      limit,
      data: events.map(event => ({ ...event, 
        attachmentsUrl: event.attachments.map(attachment => `${process.env.API_BASE_URL}/${attachment.documentPath}`), 
        photoUrls: event.photos.map(photo => `${process.env.API_BASE_URL}/${photo.url}`) })),
    };
  }

  private async logSearchMetrics(params: SearchContentDto, userId?: string) {
    if(params.name !== undefined || params.categoryName.length > 0 || params.type !== undefined){
      await this.prisma.searchMetric.create({
        data: {
            userId: userId || null,
            keyword: params.name || null,
            categoryName: params.categoryName || [],
            type: params.type || null,  // Log the type of content being searched
            timestamp: new Date(),
        },
      });
    }
  }

  private async logSearchEventMetrics(params: SearchEventDto, userId?: string) {
    if(params.title !== undefined || params.categoryName.length > 0 ){
      await this.prisma.searchMetric.create({
        data: {
            userId: userId || null,
            keyword: params.title || null,
            categoryName: params.categoryName || [],
            type:  CategoryType.EVENT || null,  // Log the type of content being searched
            timestamp: new Date(),
        },
      });
    }
  }

  
  async logViewEvent(contentId: string, contentType: CategoryType) {
    let type = contentType.toString();
    await this.prisma.contentViewLog.create({
      data: {
        contentId,
        contentType: type,
      },
    });
  }

  private async getLocationDetails(latitude: number, longitude: number) {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
    
    const response = await axios.get(url);
    
    const addressComponents = response.data.results[0].address_components;

    let city = '';
    let province = '';
    let country = '';

    addressComponents.forEach(component => {
      if (component.types.includes('locality')) {
        city = component.long_name;
      }
      if (component.types.includes('administrative_area_level_1')) {
        province = component.long_name;
      }
      if (component.types.includes('country')) {
        country = component.long_name;
      }
    });

    return { city, province, country };
  }
}
