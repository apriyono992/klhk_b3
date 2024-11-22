import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UploadedFiles,
  Param,
  Get,
  Query,
  ValidationPipe,
  UsePipes,
  BadRequestException,
  UseInterceptors,
  Put,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ContentService } from '../services/content.services';
import { CreateNewsDto } from '../models/createNewsDto';
import { CreateArticleDto } from '../models/createArticleDto';
import { CreateInfoDto } from '../models/createInfoDto';
import { CreateCompanyDocumentDto } from '../models/createCompanyDocumentDto';
import { CreateCategoryDto } from '../models/createCategoyDto';
import { SearchContentDto } from '../models/searchCotentDto';
import { UploadPhotos } from '../utils/uploadPhotos';
import { UploadFiles } from '../utils/uploadFiles';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import { CreateEventDto } from 'src/models/createEventDto';
import { SearchEventDto } from 'src/models/searchEventDto';
import { CategoryType, Status } from '@prisma/client';
import { UploadResult } from 'src/models/uploadResult';
import { IsPhotoValidFile } from 'src/validators/photoFileType.validator';
import { uploadPhotoFilesToDisk } from 'src/utils/uploadPhotoFileToDisk';
import { uploadFilesToDisk } from 'src/utils/uploadDocumentFileToDisk';
import { IsDocumentValidFile } from 'src/validators/documentFileType.validator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UpdateNewsDto } from 'src/models/updateNewsDto';
import { UpdateArticleDto } from 'src/models/updateArticleDto';
import { UpdateCompanyDocumentDto } from 'src/models/updateCompanyDocument.Dto';
import { UpdateEventDto } from 'src/models/updateEventDto';
import { JwtAuthGuard } from 'src/utils/auth.guard';
import { RolesGuard } from 'src/utils/roles.guard';
import { RolesAccess } from 'src/models/enums/roles';
import { Roles } from 'src/utils/roles.decorator';
import { PublicApiGuard } from 'src/utils/public.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Content')
@Controller('content')
export class ContentController {
  constructor(
    private readonly isPhotoValidFile: IsPhotoValidFile,
    private readonly isDocumentValidFile: IsDocumentValidFile,
    private readonly contentService: ContentService,
  ) {}

  @Post('category')
  @Roles(RolesAccess.SUPER_ADMIN, RolesAccess.PIC_CMS)   
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
    schema: {
      example: {
        id: 'category123',
        name: 'Technology',
        description: 'Category for tech-related content',
        createdAt: '2024-10-19T10:00:00Z',
        updatedAt: '2024-10-19T10:00:00Z',
      },
    },
  })
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.contentService.createCategory(createCategoryDto);
  }

  @Post('news')
  @Roles(RolesAccess.SUPER_ADMIN, RolesAccess.PIC_CMS) 
  @ApiOperation({ summary: 'Create a news article' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateNewsDto })
  @ApiResponse({
    status: 201,
    description: 'News article created successfully',
    schema: {
      example: {
        id: 'news123',
        title: 'New Environmental Policies Announced',
        content: 'Detailed article about new policies...',
        attachments: [
          {
            fileUrl: 'http://localhost:3000/uploads/photos/image1.jpg',
            filePath: '/uploads/photos/image1.jpg',
          },
        ],
        createdAt: '2024-10-19T10:00:00Z',
        updatedAt: '2024-10-19T10:00:00Z',
      },
    },
  })
  @UseInterceptors(FilesInterceptor('attachments'))
  async createNews(
    @UploadedFiles() attachments: Express.Multer.File[],
    @Body() createNewsDto: CreateNewsDto,
  ) {
    return this.handlePhotosUpload(
      createNewsDto,
      attachments,
      (dto, attachmentsData) =>
        this.contentService.createNews({
          ...dto,
          attachments: attachmentsData,
        }),
    );
  }

  @Put('news/:id')
  @Roles(RolesAccess.SUPER_ADMIN, RolesAccess.PIC_CMS) 
  @ApiOperation({ summary: 'Update news' })
  @ApiParam({ name: 'id', type: String, description: 'News ID' })
  @ApiBody({
    type: UpdateNewsDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Update news successfully',
    schema: {
      example: {
        message: 'News updated successfully',
        news: {
          id: 'news123',
          title: 'New Environmental Policies Announced',
          content: 'Detailed article about new policies...',
          attachments: [
            {
              fileUrl: 'http://localhost:3000/uploads/photos/image1.jpg',
              filePath: '/uploads/photos/image1.jpg',
            },
          ],
          createdAt: '2024-10-19T10:00:00Z',
          updatedAt: '2024-10-19T10:00:00Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'News not found.' })
  @ApiResponse({ status: 409, description: 'Unique constraint violation.' })
  @UseInterceptors(FilesInterceptor('attachments'))
  async updateNews(
    @UploadedFiles() attachments: Express.Multer.File[],
    @Param('id') id: string,
    @Body() updateNewsDto: UpdateNewsDto,
  ) {
    if (attachments.length > 0) {
      return this.handlePhotosUpload(
        updateNewsDto,
        attachments,
        (dto, attachmentsData) =>
          this.contentService.updateNews(id, {
            ...dto,
            attachments: attachmentsData,
          }),
      );
    } else {
      return this.contentService.updateNews(id, updateNewsDto);
    }
  }

  @Delete('news/:id')
  @Roles(RolesAccess.SUPER_ADMIN, RolesAccess.PIC_CMS) 
  @ApiOperation({ summary: 'Delete News' })
  @ApiParam({ name: 'id', description: 'ID of the news' })
  @ApiResponse({
    status: 200,
    description: 'News deleted successfully.',
    schema: {
      example: {
        message: 'News deleted successfully.',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'News not found.' })
  async deleteNews(@Param('id') id: string) {
    await this.contentService.deleteNews(id);
    return { message: 'News deleted successfully.' };
  }

  @Post('article')
  @ApiOperation({ summary: 'Create an article' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateArticleDto })
  @ApiResponse({
    status: 201,
    description: 'Article created successfully',
    schema: {
      example: {
        id: 'article123',
        title: 'Understanding Climate Change',
        content: 'This article explains the effects of climate change...',
        attachments: [
          {
            fileUrl: 'http://localhost:3000/uploads/photos/image2.jpg',
            filePath: '/uploads/photos/image2.jpg',
          },
        ],
        createdAt: '2024-10-19T10:00:00Z',
        updatedAt: '2024-10-19T10:00:00Z',
      },
    },
  })
  @UseInterceptors(FilesInterceptor('attachments'))
  async createArticle(
    @Body() createArticleDto: CreateArticleDto,
    @UploadedFiles() attachments: Express.Multer.File[],
  ) {
    return this.handlePhotosUpload(
      createArticleDto,
      attachments,
      (dto, attachmentsData) =>
        this.contentService.createArticle({
          ...dto,
          attachments: attachmentsData,
        }),
    );
  }

  @Put('article/:id')
  @Roles(RolesAccess.SUPER_ADMIN, RolesAccess.PIC_CMS) 
  @ApiOperation({ summary: 'Update article' })
  @ApiParam({ name: 'id', type: String, description: 'Article ID' })
  @ApiBody({
    type: UpdateArticleDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Update article successfully',
    schema: {
      example: {
        message: 'Article updated successfully',
        article: {
          id: 'article123',
          title: 'New Environmental Policies Announced',
          content: 'Detailed article about new policies...',
          attachments: [
            {
              fileUrl: 'http://localhost:3000/uploads/photos/image1.jpg',
              filePath: '/uploads/photos/image1.jpg',
            },
          ],
          createdAt: '2024-10-19T10:00:00Z',
          updatedAt: '2024-10-19T10:00:00Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  @ApiResponse({ status: 409, description: 'Unique constraint violation.' })
  @UseInterceptors(FilesInterceptor('attachments'))
  async updateArticle(
    @UploadedFiles() attachments: Express.Multer.File[],
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    if (attachments.length > 0) {
      return this.handlePhotosUpload(
        updateArticleDto,
        attachments,
        (dto, attachmentsData) =>
          this.contentService.updateArticle(id, {
            ...dto,
            attachments: attachmentsData,
          }),
      );
    } else {
      return this.contentService.updateArticle(id, updateArticleDto);
    }
  }

  @Delete('article/:id')
  @Roles(RolesAccess.SUPER_ADMIN, RolesAccess.PIC_CMS) 
  @ApiOperation({ summary: 'Delete Article' })
  @ApiParam({ name: 'id', description: 'ID of the article' })
  @ApiResponse({
    status: 200,
    description: 'Article deleted successfully.',
    schema: {
      example: {
        message: 'Article deleted successfully.',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  async deleteArticle(@Param('id') id: string) {
    await this.contentService.deleteArticle(id);
    return { message: 'Article deleted successfully.' };
  }

  @Post('info')
  @Roles(RolesAccess.SUPER_ADMIN, RolesAccess.PIC_CMS) 
  @ApiOperation({ summary: 'Create an informational post' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateInfoDto })
  @ApiResponse({
    status: 201,
    description: 'Informational post created successfully',
    schema: {
      example: {
        id: 'info123',
        title: 'Water Conservation Tips',
        content: 'This post provides tips on conserving water...',
        attachments: [
          {
            fileUrl: 'http://localhost:3000/uploads/photos/image3.jpg',
            filePath: '/uploads/photos/image3.jpg',
          },
        ],
        createdAt: '2024-10-19T10:00:00Z',
        updatedAt: '2024-10-19T10:00:00Z',
      },
    },
  })
  @UseInterceptors(FilesInterceptor('attachments'))
  async createInfo(
    @Body() createInfoDto: CreateInfoDto,
    @UploadedFiles() attachments: Express.Multer.File[],
  ) {
    return this.handlePhotosUpload(
      createInfoDto,
      attachments,
      (dto, attachmentsData) =>
        this.contentService.createInfo({
          ...dto,
          attachments: attachmentsData,
        }),
    );
  }

  @Post('document')
  @Roles(RolesAccess.SUPER_ADMIN, RolesAccess.PIC_CMS) 
  @ApiOperation({ summary: 'Create a company document' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateCompanyDocumentDto })
  @ApiResponse({
    status: 201,
    description: 'Company document created successfully',
    schema: {
      example: {
        id: 'document123',
        title: 'Annual Report 2024',
        content: "The company's annual report for 2024...",
        attachments: [
          {
            fileUrl: 'http://localhost:3000/uploads/documents/report.pdf',
            filePath: '/uploads/documents/report.pdf',
          },
        ],
        createdAt: '2024-10-19T10:00:00Z',
        updatedAt: '2024-10-19T10:00:00Z',
      },
    },
  })
  @UseInterceptors(FilesInterceptor('attachments'))
  async createCompanyDocument(
    @Body() createCompanyDocumentDto: CreateCompanyDocumentDto,
    @UploadedFile() attachments: Express.Multer.File[],
  ) {
    return this.handleDocumentsUpload(
      createCompanyDocumentDto,
      attachments,
      (dto, attachmentsData) =>
        this.contentService.createCompanyDocument({
          ...dto,
          attachments: attachmentsData,
        }),
    );
  }

  @Put('document/:id')
  @Roles(RolesAccess.SUPER_ADMIN, RolesAccess.PIC_CMS) 
  @ApiOperation({ summary: 'Update company document' })
  @ApiParam({ name: 'id', type: String, description: 'Company document ID' })
  @ApiBody({
    type: UpdateCompanyDocumentDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Update company document successfully',
    schema: {
      example: {
        message: 'Company document updated successfully',
        article: {
          id: 'article123',
          title: 'New Environmental Policies Announced',
          description: 'Detailed document about new policies...',
          attachments: [
            {
              fileUrl: 'http://localhost:3000/uploads/attachment/pdf1.pdf',
              filePath: '/uploads/attachment/pdf1.pdf',
            },
          ],
          createdAt: '2024-10-19T10:00:00Z',
          updatedAt: '2024-10-19T10:00:00Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Company document not found.' })
  @ApiResponse({ status: 409, description: 'Unique constraint violation.' })
  @UseInterceptors(FilesInterceptor('attachments'))
  async updateCompanyDocument(
    @UploadedFiles() attachments: Express.Multer.File[],
    @Param('id') id: string,
    @Body() updateCompanyDocumentDto: UpdateCompanyDocumentDto,
  ) {
    if (attachments.length > 0) {
      return this.handleDocumentsUpload(
        updateCompanyDocumentDto,
        attachments,
        (dto, attachmentsData) =>
          this.contentService.updateCompanyDocument(id, {
            ...dto,
            attachments: attachmentsData,
          }),
      );
    } else {
      return this.contentService.updateCompanyDocument(
        id,
        updateCompanyDocumentDto,
      );
    }
  }

  @Delete('document/:id')
  @Roles(RolesAccess.SUPER_ADMIN, RolesAccess.PIC_CMS) 
  @ApiOperation({ summary: 'Delete Company Document' })
  @ApiParam({ name: 'id', description: 'ID of the document' })
  @ApiResponse({
    status: 200,
    description: 'Company document deleted successfully.',
    schema: {
      example: {
        message: 'Company document deleted successfully.',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Company document not found.' })
  async deleteCompanyDocument(@Param('id') id: string) {
    await this.contentService.deleteCompanyDocument(id);
    return { message: 'Company document deleted successfully.' };
  }

  @Post('event')
  @Roles(RolesAccess.SUPER_ADMIN, RolesAccess.PIC_CMS) 
  @ApiOperation({ summary: 'Create a new event with geolocation' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({
    status: 201,
    description: 'Event created successfully',
    schema: {
      example: {
        id: 'event123',
        title: 'Tech Conference 2024',
        description: 'A tech conference featuring the latest innovations...',
        location: 'Jakarta',
        photos: [
          {
            fileUrl: 'http://localhost:3000/uploads/photos/event_image.jpg',
            filePath: '/uploads/photos/event_image.jpg',
          },
        ],
        documents: [
          {
            fileUrl: 'http://localhost:3000/uploads/documents/event_agenda.pdf',
            filePath: '/uploads/documents/event_agenda.pdf',
          },
        ],
        createdAt: '2024-10-19T10:00:00Z',
        updatedAt: '2024-10-19T10:00:00Z',
      },
    },
  })
  // @UseInterceptors(FilesInterceptor('documents'))
  @UseInterceptors(FilesInterceptor('photos'))
  async createEvent(
    // @UploadedFiles() documents: Express.Multer.File[],
    @UploadedFiles() photos: Express.Multer.File[],
    @Body()
    createEventDto: CreateEventDto,
  ) {
    return this.handlePhotosUpload(
      createEventDto,
      photos,
      (dto, attachmentsData) =>
        this.contentService.createEvent({
          ...dto,
          photos: attachmentsData,
        }),
    );

    // return this.handlePhotosUpload(
    //   createEventDto,
    //   // documents,
    //   photos,
    //   (dto, documentsData, photosData) =>
    //     this.contentService.createEvent({
    //       ...dto,
    //       photos: photosData,
    //       documents: documentsData,
    //     }),
    // );
  }

  @Put('event/:id')
  @ApiOperation({ summary: 'Update event' })
  @Roles(RolesAccess.SUPER_ADMIN, RolesAccess.PIC_CMS) 
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', type: String, description: 'Event ID' })
  @ApiBody({
    type: UpdateEventDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Update event successfully',
    schema: {
      example: {
        message: 'Event updated successfully',
        event: {
          id: 'event123',
          title: 'Tech Conference 2024',
          description: 'A tech conference featuring the latest innovations...',
          location: 'Jakarta',
          photos: [
            {
              fileUrl: 'http://localhost:3000/uploads/photos/event_image.jpg',
              filePath: '/uploads/photos/event_image.jpg',
            },
          ],
          documents: [
            {
              fileUrl:
                'http://localhost:3000/uploads/documents/event_agenda.pdf',
              filePath: '/uploads/documents/event_agenda.pdf',
            },
          ],
          createdAt: '2024-10-19T10:00:00Z',
          updatedAt: '2024-10-19T10:00:00Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  @ApiResponse({ status: 409, description: 'Unique constraint violation.' })
  @UseInterceptors(FilesInterceptor('documents'))
  @UseInterceptors(FilesInterceptor('photos'))
  async updateEvent(
    @UploadedFile() documents: Express.Multer.File[],
    @UploadedFile() photos: Express.Multer.File[],
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    if (documents.length > 0 || photos.length > 0) {
      return this.handleUploadPhotosAndDocument(
        updateEventDto,
        documents,
        photos,
        (dto, documentsData, photosData) =>
          this.contentService.updateEvent(id, {
            ...dto,
            photos: photosData,
            documents: documentsData,
          }),
      );
    } else {
      return this.contentService.updateEvent(id, updateEventDto);
    }
  }

  @Delete('event/:id')
  @Roles(RolesAccess.SUPER_ADMIN, RolesAccess.PIC_CMS) 
  @ApiOperation({ summary: 'Delete event' })
  @ApiParam({ name: 'id', description: 'ID of the event' })
  @ApiResponse({
    status: 200,
    description: 'Event deleted successfully.',
    schema: {
      example: {
        message: 'Event deleted successfully.',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  async deleteEvent(@Param('id') id: string) {
    await this.contentService.deleteEvent(id);
    return { message: 'Event deleted successfully.' };
  }

  @Get('news/:slug')
  @UseGuards(PublicApiGuard)
  @ApiOperation({ summary: 'Get news by slug' })
  @ApiResponse({
    status: 200,
    description: 'Returns the news article by slug',
    schema: {
      example: {
        id: 'news123',
        title: 'New Environmental Policies Announced',
        content: 'Detailed article about new policies...',
        createdAt: '2024-10-19T10:00:00Z',
        updatedAt: '2024-10-19T10:00:00Z',
      },
    },
  })
  getNewsBySlug(@Param('slug') slug: string) {
    return this.contentService.getNewsBySlug(slug);
  }

  @Get('article/:slug')
  @UseGuards(PublicApiGuard)
  @ApiOperation({ summary: 'Get article by slug' })
  @ApiResponse({
    status: 200,
    description: 'Returns the article by slug',
    schema: {
      example: {
        id: 'article123',
        title: 'Understanding Climate Change',
        content: 'This article explains the effects of climate change...',
        createdAt: '2024-10-19T10:00:00Z',
        updatedAt: '2024-10-19T10:00:00Z',
      },
    },
  })
  getArticleBySlug(@Param('slug') slug: string) {
    return this.contentService.getArticleBySlug(slug);
  }

  @Get('info/:slug')
  @UseGuards(PublicApiGuard)
  @ApiOperation({ summary: 'Get info by slug' })
  @ApiResponse({
    status: 200,
    description: 'Returns the informational post by slug',
    schema: {
      example: {
        id: 'info123',
        title: 'Water Conservation Tips',
        content: 'This post provides tips on conserving water...',
        createdAt: '2024-10-19T10:00:00Z',
        updatedAt: '2024-10-19T10:00:00Z',
      },
    },
  })
  getInfoBySlug(@Param('slug') slug: string) {
    return this.contentService.getInfoBySlug(slug);
  }

  @Get('document/:slug')
  @UseGuards(PublicApiGuard)
  @ApiOperation({ summary: 'Get company document by slug' })
  @ApiResponse({
    status: 200,
    description: 'Returns the company document by slug',
    schema: {
      example: {
        id: 'document123',
        title: 'Annual Report 2024',
        content: "The company's annual report for 2024...",
        createdAt: '2024-10-19T10:00:00Z',
        updatedAt: '2024-10-19T10:00:00Z',
      },
    },
  })
  getCompanyDocumentBySlug(@Param('slug') slug: string) {
    return this.contentService.getCompanyDocumentBySlug(slug);
  }

  @Get('search')
  @UseGuards(PublicApiGuard)
  @ApiOperation({ summary: 'Search content' })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'categoryName', required: false })
  @ApiQuery({ name: 'type', required: false, enum: CategoryType })
  @ApiQuery({ name: 'status', required: false, enum: Status })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Returns search results for content',
    schema: {
      example: {
        total: 100,
        page: 1,
        limit: 10,
        content: [
          {
            id: 'news123',
            title: 'New Environmental Policies Announced',
            category: 'Environment',
            createdAt: '2024-10-19T10:00:00Z',
            updatedAt: '2024-10-19T10:00:00Z',
          },
          {
            id: 'article123',
            title: 'Understanding Climate Change',
            category: 'Science',
            createdAt: '2024-10-19T10:00:00Z',
            updatedAt: '2024-10-19T10:00:00Z',
          },
        ],
      },
    },
  })
  searchContent(@Query() searchContentDto: SearchContentDto) {
    return this.contentService.searchContent(searchContentDto);
  }

  @Get('search-event')
  @UseGuards(PublicApiGuard)
  @ApiOperation({ summary: 'Search for events with pagination' })
  @ApiQuery({
    name: 'title',
    required: false,
    description: 'The title of the event',
  })
  @ApiQuery({
    name: 'categoryName',
    required: false,
    description: 'Comma-separated category names',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'The start date of the event',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'The end date of the event',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns search results for events',
    schema: {
      example: {
        total: 50,
        page: 1,
        limit: 10,
        events: [
          {
            id: 'event123',
            title: 'Tech Conference 2024',
            category: 'Technology',
            createdAt: '2024-10-19T10:00:00Z',
            updatedAt: '2024-10-19T10:00:00Z',
          },
        ],
      },
    },
  })
  async searchEvents(
    @Query(new ValidationPipe({ transform: true }))
    searchEventDto: SearchEventDto,
  ) {
    return this.contentService.searchEvents(searchEventDto);
  }

  @Get('search-articles')
  @ApiOperation({ summary: 'Search for articles with pagination' })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'The name of the article',
  })
  @ApiQuery({
    name: 'categoryName',
    required: false,
    description: 'Comma-separated category names',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'The start date of the article',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'The end date of the article',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns search results for articles',
    schema: {
      example: {
        total: 75,
        page: 1,
        limit: 10,
        articles: [
          {
            id: 'article123',
            title: 'Understanding Climate Change',
            category: 'Environment',
            createdAt: '2024-10-19T10:00:00Z',
            updatedAt: '2024-10-19T10:00:00Z',
          },
        ],
      },
    },
  })
  async searchArticles(
    @Query(new ValidationPipe({ transform: true }))
    searchContentDto: SearchContentDto,
  ) {
    return this.contentService.searchArticles(searchContentDto);
  }

  @Get('search-news')
  @UseGuards(PublicApiGuard)
  @ApiOperation({ summary: 'Search for news with pagination' })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'The name of the news',
  })
  @ApiQuery({
    name: 'categoryName',
    required: false,
    description: 'Comma-separated category names',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'The start date of the news',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'The end date of the news',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns search results for news',
    schema: {
      example: {
        total: 80,
        page: 1,
        limit: 10,
        news: [
          {
            id: 'news123',
            title: 'New Environmental Policies Announced',
            category: 'Government',
            createdAt: '2024-10-19T10:00:00Z',
            updatedAt: '2024-10-19T10:00:00Z',
          },
        ],
      },
    },
  })
  async searchNews(
    @Query(new ValidationPipe({ transform: true }))
    searchContentDto: SearchContentDto,
  ) {
    return this.contentService.searchNews(searchContentDto);
  }

  @Get('search-info')
  @ApiOperation({ summary: 'Search for info with pagination' })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'The name of the info',
  })
  @ApiQuery({
    name: 'categoryName',
    required: false,
    description: 'Comma-separated category names',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'The start date of the info',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'The end date of the info',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns search results for info',
    schema: {
      example: {
        total: 60,
        page: 1,
        limit: 10,
        info: [
          {
            id: 'info123',
            title: 'Water Conservation Tips',
            category: 'Environment',
            createdAt: '2024-10-19T10:00:00Z',
            updatedAt: '2024-10-19T10:00:00Z',
          },
        ],
      },
    },
  })
  async searchInfo(
    @Query(new ValidationPipe({ transform: true }))
    searchContentDto: SearchContentDto,
  ) {
    return this.contentService.searchInfo(searchContentDto);
  }

  @Get('search-document')
  @ApiOperation({ summary: 'Search for company documents with pagination' })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'The name of the document',
  })
  @ApiQuery({
    name: 'categoryName',
    required: false,
    description: 'Comma-separated category names',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'The start date of the document',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'The end date of the document',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns search results for company documents',
    schema: {
      example: {
        total: 40,
        page: 1,
        limit: 10,
        documents: [
          {
            id: 'document123',
            title: 'Annual Report 2024',
            category: 'Finance',
            createdAt: '2024-10-19T10:00:00Z',
            updatedAt: '2024-10-19T10:00:00Z',
          },
        ],
      },
    },
  })
  async searchCompanyDocuments(
    @Query(new ValidationPipe({ transform: true }))
    searchContentDto: SearchContentDto,
  ) {
    return this.contentService.searchCompanyDocuments(searchContentDto);
  }

  @Get('category')
  @ApiOperation({ summary: 'Get content category' })
  @ApiQuery({ name: 'type', required: false })
  @ApiResponse({
    status: 200,
    description: 'Returns the content category',
    schema: {
      example: {
        id: 'article123',
        title: 'Understanding Climate Change',
        content: 'This article explains the effects of climate change...',
        createdAt: '2024-10-19T10:00:00Z',
        updatedAt: '2024-10-19T10:00:00Z',
      },
    },
  })
  async getCategoryList(@Query('type') type: CategoryType) {
    return this.contentService.getCategoryList(type);
  }

  private async handlePhotosUpload(
    dto: any,
    attachments: Express.Multer.File[],
    serviceMethod: (dto: any, attachmentsData: any) => Promise<any>,
  ) {
    // 1. Handle the uploaded photos
    let uploadedFiles: UploadResult[] = [];

    this.isPhotoValidFile.validateAndThrow(attachments);

    if (attachments && attachments.length > 0) {
      // Handle file saving using your utility function
      uploadedFiles = uploadPhotoFilesToDisk(attachments);
    }

    const attachmentData = uploadedFiles.map((file) => ({
      fileUrl: `/uploads/photos/${file.filename}`,
      filePath: `/uploads/photos/${file.filename}`,
    }));

    try {
      // If DTO validation passes, continue to service call
      return await serviceMethod(dto, attachmentData);
    } catch (error) {
      // On failure, delete the uploaded files
      this.handlePhotosFileDeletion(attachments);
      throw error; // Re-throw to be handled by NestJS
    }
  }

  private async handleDocumentsUpload(
    dto: any,
    attachments: Express.Multer.File[],
    serviceMethod: (dto: any, attachmentsData: any) => Promise<any>,
  ) {
    // 1. Handle the uploaded photos
    let uploadedFiles: UploadResult[] = [];

    this.isDocumentValidFile.validateAndThrow(attachments);

    if (attachments && attachments.length > 0) {
      // Handle file saving using your utility function
      uploadedFiles = uploadFilesToDisk(attachments);
    }

    const attachmentData = uploadedFiles.map((file) => ({
      fileUrl: `/uploads/documents/${file.filename}`,
      filePath: `/uploads/documents/${file.filename}`,
    }));

    try {
      // If DTO validation passes, continue to service call
      return await serviceMethod(dto, attachmentData);
    } catch (error) {
      // On failure, delete the uploaded files
      this.handleDocumentsFileDeletion(attachments);
      throw error; // Re-throw to be handled by NestJS
    }
  }

  private async handleUploadPhotosAndDocument(
    dto: any,
    documents: Express.Multer.File[],
    photos: Express.Multer.File[],
    serviceMethod: (dto: any, documents: any, photos: any) => Promise<any>,
  ) {
    // 1. Handle the uploaded photos
    let uploadedDocumentFiles: UploadResult[] = [];
    let uploadPhotoFile: UploadResult[] = [];

    this.isPhotoValidFile.validateAndThrow(photos);
    this.isDocumentValidFile.validateAndThrow(documents);

    if (documents && documents.length > 0) {
      // Handle file saving using your utility function
      uploadedDocumentFiles = uploadPhotoFilesToDisk(documents);
    }

    if (photos && photos.length > 0) {
      // Handle file saving using your utility function
      uploadPhotoFile = uploadPhotoFilesToDisk(photos);
    }

    const photosData = uploadPhotoFile.map((file) => ({
      fileUrl: `/uploads/photos/${file.filename}`,
      filePath: `/uploads/photos/${file.filename}`,
    }));

    const documentsData = uploadedDocumentFiles.map((file) => ({
      fileUrl: `/uploads/documents/${file.filename}`,
      filePath: `/uploads/documents/${file.filename}`,
    }));

    try {
      // If DTO validation passes, continue to service call
      return await serviceMethod(dto, documentsData, photosData);
    } catch (error) {
      throw error; // Re-throw to be handled by NestJS
    }
  }

  private handlePhotosFileDeletion(filesArray: Express.Multer.File[]) {
    filesArray.forEach((file) => {
      const filePath = path.join(
        __dirname,
        '../../uploads/photos',
        file.filename,
      );
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Failed to delete file ${filePath}:`, err);
        } else {
          console.log(`File ${filePath} deleted successfully.`);
        }
      });
    });
  }

  private handleDocumentsFileDeletion(filesArray: Express.Multer.File[]) {
    filesArray.forEach((file) => {
      const filePath = path.join(
        __dirname,
        '../../documents/photos',
        file.filename,
      );
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Failed to delete file ${filePath}:`, err);
        } else {
          console.log(`File ${filePath} deleted successfully.`);
        }
      });
    });
  }
}
