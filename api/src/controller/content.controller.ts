import { Controller, Post, Body, UploadedFile, UploadedFiles, Param, Get, Query, ValidationPipe, UsePipes, BadRequestException } from '@nestjs/common';
import { ContentService } from '../services/content.services';
import { CreateNewsDto } from '../models/CreateNewsDto';
import { CreateArticleDto } from '../models/createArticleDto';
import { CreateInfoDto } from '../models/createInfoDto';
import { CreateCompanyDocumentDto } from '../models/createCompanyDocumentDto';
import { CreateCategoryDto } from '../models/createCategoyDto';
import { SearchContentDto } from '../models/searchCotentDto';
import { UploadPhotos } from '../utils/uploadPhotos';
import { UploadFiles } from '../utils/uploadFiles';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiQuery } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import { CreateEventDto } from 'src/models/createEventDto';
import { SearchEventDto } from 'src/models/searchEventDto';
import { CategoryType, Status } from '@prisma/client';

@ApiTags('Content')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post('category')
  @ApiOperation({ summary: 'Create a new category' })
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.contentService.createCategory(createCategoryDto);
  }

  @Post('news')
  @ApiOperation({ summary: 'Create a news article' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateNewsDto })
  @UploadPhotos()
  async createNews(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) createNewsDto: CreateNewsDto,
    @UploadedFiles() attachments: Express.Multer.File[] | Express.Multer.File
  ) {
    return this.handlePhotosUpload(createNewsDto, attachments, (dto, attachmentsData) => 
      this.contentService.createNews({ ...dto, attachments: attachmentsData })
    );
  }

  @Post('article')
  @ApiOperation({ summary: 'Create an article' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateArticleDto })
  @UploadPhotos()
  async createArticle(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) createArticleDto: CreateArticleDto,
    @UploadedFiles() attachments: Express.Multer.File[] | Express.Multer.File
  ) {
    return this.handlePhotosUpload(createArticleDto, attachments, (dto, attachmentsData) => 
      this.contentService.createArticle({ ...dto, attachments: attachmentsData })
    );
  }

  @Post('info')
  @ApiOperation({ summary: 'Create an informational post' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateInfoDto })
  @UploadPhotos()
  async createInfo(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) createInfoDto: CreateInfoDto,
    @UploadedFiles() attachments: Express.Multer.File[] | Express.Multer.File
  ) {
    return this.handlePhotosUpload(createInfoDto, attachments, (dto, attachmentsData) => 
      this.contentService.createInfo({ ...dto, attachments: attachmentsData })
    );
  }

  @Post('document')
  @ApiOperation({ summary: 'Create a company document' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateCompanyDocumentDto })
  @UploadFiles()
  async createCompanyDocument(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) createCompanyDocumentDto: CreateCompanyDocumentDto,
    @UploadedFile() attachments: Express.Multer.File[] | Express.Multer.File
  ) {
    return this.handleDocumentsUpload(createCompanyDocumentDto, attachments, (dto, attachmentsData) => 
      this.contentService.createCompanyDocument({ ...dto, attachments: attachmentsData })
    );
  }

  @Post('event')
  @ApiOperation({ summary: 'Create a new event with geolocation' })
  @ApiConsumes('multipart/form-data')
  @UploadFiles('documents')
  @UploadPhotos('photos')
  @ApiBody({ type: CreateEventDto })
  async createEvent(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) createEventDto: CreateEventDto,
    @UploadedFile() documents: Express.Multer.File[] | Express.Multer.File,
    @UploadedFile() photos: Express.Multer.File[] | Express.Multer.File
  ) {
    return this.handleUploadPhotosAndDocument(createEventDto, documents,  photos , ( dto, documentsData, photosData) => 
      this.contentService.createEvent({ ...dto, photos: photosData, documents: documentsData })
    );
  }

  @Get('news/:slug')
  @ApiOperation({ summary: 'Get news by slug' })
  getNewsBySlug(@Param('slug') slug: string) {
    return this.contentService.getNewsBySlug(slug);
  }

  @Get('article/:slug')
  @ApiOperation({ summary: 'Get article by slug' })
  getArticleBySlug(@Param('slug') slug: string) {
    return this.contentService.getArticleBySlug(slug);
  }

  @Get('info/:slug')
  @ApiOperation({ summary: 'Get info by slug' })
  getInfoBySlug(@Param('slug') slug: string) {
    return this.contentService.getInfoBySlug(slug);
  }

  @Get('document/:slug')
  @ApiOperation({ summary: 'Get company document by slug' })
  getCompanyDocumentBySlug(@Param('slug') slug: string) {
    return this.contentService.getCompanyDocumentBySlug(slug);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search content' })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'categoryName', required: false})
  @ApiQuery({ name: 'type', required: false, enum: CategoryType })
  @ApiQuery({ name: 'status', required: false, enum: Status })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  searchContent(@Query() searchContentDto: SearchContentDto) {
    return this.contentService.searchContent(searchContentDto);
  }

  @Get('search-event')
  @ApiOperation({ summary: 'Search for events with pagination' })
  @ApiQuery({ name: 'title', required: false, description: 'The title of the event' })
  @ApiQuery({ name: 'categoryName', required: false, description: 'Comma-separated category names' })
  @ApiQuery({ name: 'startDate', required: false, description: 'The start date of the event' })
  @ApiQuery({ name: 'endDate', required: false, description: 'The end date of the event' })
  async searchEvents(@Query(new ValidationPipe({ transform: true })) searchEventDto: SearchEventDto) {
    return this.contentService.searchEvents(searchEventDto);
  }

  @Get('search-articles')
  @ApiOperation({ summary: 'Search for articles with pagination' })
  @ApiQuery({ name: 'name', required: false, description: 'The name of the article' })
  @ApiQuery({ name: 'categoryName', required: false, description: 'Comma-separated category names' })
  @ApiQuery({ name: 'startDate', required: false, description: 'The start date of the article' })
  @ApiQuery({ name: 'endDate', required: false, description: 'The end date of the article' })
  async searchArticles(@Query(new ValidationPipe({ transform: true })) searchContentDto: SearchContentDto) {
    return this.contentService.searchArticles(searchContentDto);
  }

  @Get('search-news')
  @ApiOperation({ summary: 'Search for news with pagination' })
  @ApiQuery({ name: 'name', required: false, description: 'The name of the news' })
  @ApiQuery({ name: 'categoryName', required: false, description: 'Comma-separated category names' })
  @ApiQuery({ name: 'startDate', required: false, description: 'The start date of the news' })
  @ApiQuery({ name: 'endDate', required: false, description: 'The end date of the news' })
  async searchNews(@Query(new ValidationPipe({ transform: true })) searchContentDto: SearchContentDto) {
    return this.contentService.searchNews(searchContentDto);
  }

  @Get('search-info')
  @ApiOperation({ summary: 'Search for info with pagination' })
  @ApiQuery({ name: 'name', required: false, description: 'The name of the info' })
  @ApiQuery({ name: 'categoryName', required: false, description: 'Comma-separated category names' })
  @ApiQuery({ name: 'startDate', required: false, description: 'The start date of the info' })
  @ApiQuery({ name: 'endDate', required: false, description: 'The end date of the info' })
  async searchInfo(@Query(new ValidationPipe({ transform: true })) searchContentDto: SearchContentDto) {
    return this.contentService.searchInfo(searchContentDto);
  }

  @Get('search-document')
  @ApiOperation({ summary: 'Search for company documents with pagination' })
  @ApiQuery({ name: 'name', required: false, description: 'The name of the document' })
  @ApiQuery({ name: 'categoryName', required: false, description: 'Comma-separated category names' })
  @ApiQuery({ name: 'startDate', required: false, description: 'The start date of the document' })
  @ApiQuery({ name: 'endDate', required: false, description: 'The end date of the document' })
  async searchCompanyDocuments(@Query(new ValidationPipe({ transform: true })) searchContentDto: SearchContentDto) {
    return this.contentService.searchCompanyDocuments(searchContentDto);
  }

  private async handlePhotosUpload(dto: any, attachments: Express.Multer.File[] | Express.Multer.File, serviceMethod: (dto: any, attachmentsData: any) => Promise<any>) {
    const filesArray = Array.isArray(attachments) ? attachments : attachments ? [attachments] : [];

    const attachmentData = filesArray.map(file => ({
      fileUrl: `${process.env.BASE_URL}/uploads/photos/${file.filename}`,
      filePath: `/uploads/photos/${file.filename}`,
    }));

    try {
      // If DTO validation passes, continue to service call
      return await serviceMethod(dto, attachmentData);
    } catch (error) {
      // On failure, delete the uploaded files
      this.handlePhotosFileDeletion(filesArray);
      throw error; // Re-throw to be handled by NestJS
    }
  }

  private async handleDocumentsUpload(dto: any, attachments: Express.Multer.File[] | Express.Multer.File, serviceMethod: (dto: any, attachmentsData: any) => Promise<any>) {
    const filesArray = Array.isArray(attachments) ? attachments : attachments ? [attachments] : [];

    const attachmentData = filesArray.map(file => ({
      fileUrl: `${process.env.BASE_URL}/uploads/documents/${file.filename}`,
      filePath: `/uploads/documents/${file.filename}`,
    }));

    try {
      // If DTO validation passes, continue to service call
      return await serviceMethod(dto, attachmentData);
    } catch (error) {
      // On failure, delete the uploaded files
      this.handleDocumentsFileDeletion(filesArray);
      throw error; // Re-throw to be handled by NestJS
    }
  }

  private async handleUploadPhotosAndDocument(dto: any, documents: Express.Multer.File[] | Express.Multer.File, photos: Express.Multer.File[] | Express.Multer.File, serviceMethod: (dto: any, documents: any, photos: any) => Promise<any>) {
    const documentsArray = Array.isArray(documents) ? documents : documents ? [documents] : [];
    const photosArray = Array.isArray(photos) ? photos : photos ? [photos] : [];

    const photosData = photosArray.map(file => ({
      fileUrl: `${process.env.BASE_URL}/uploads/photos/${file.filename}`,
      filePath: `/uploads/photos/${file.filename}`,
    }));

    const documentsData = documentsArray.map(file => ({
      fileUrl: `${process.env.BASE_URL}/uploads/documents/${file.filename}`,
      filePath: `/uploads/documents/${file.filename}`,
    }));

    try {
      // If DTO validation passes, continue to service call
      return await serviceMethod(dto, documentsData, photosData);
    } catch (error) {
      // On failure, delete the uploaded files
      this.handleDocumentsFileDeletion(documentsArray);
      this.handlePhotosFileDeletion(photosArray);
      throw error; // Re-throw to be handled by NestJS
    }
  }

  private handlePhotosFileDeletion(filesArray: Express.Multer.File[]) {
    filesArray.forEach(file => {
      const filePath = path.join(__dirname, '../../uploads/photos', file.filename);
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
    filesArray.forEach(file => {
      const filePath = path.join(__dirname, '../../documents/photos', file.filename);
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
