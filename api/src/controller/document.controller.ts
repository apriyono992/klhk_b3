import {
  Controller,
  Post,
  Get,
  Body,
  UseInterceptors,
  UploadedFiles,
  Res,
  Query,
  BadRequestException,
  Param,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateDocumentDto } from 'src/models/createDocumentDto';
import { ValidateDocumentDto } from 'src/models/validateDocumentDto';
import { UploadResult } from 'src/models/uploadResult';
import { DocumentService } from 'src/services/document.services';
import { uploadFilesToDisk } from 'src/utils/uploadDocumentFileToDisk';
import { IsDocumentValidFile } from 'src/validators/documentFileType.validator';
import * as fs from 'fs';

@ApiTags('DocumentRekomendasiB3')
@Controller('documents')
export class DocumentController {
  constructor(
    private readonly documentService: DocumentService,
    private readonly isDocumentValidFile: IsDocumentValidFile,
  ) {}

  // Upload or replace a document for an application
  @Post('upload')
  @ApiOperation({ summary: 'Upload or replace a document for an application' })
  @UseInterceptors(FilesInterceptor('attachments')) // Handle multiple file uploads
  async uploadDocuments(
    @UploadedFiles() attachments: Express.Multer.File[],
    @Body() createDocumentDto: CreateDocumentDto,
  ) {
    let uploadedFiles: UploadResult[] = [];

    // Validate the files
    this.isDocumentValidFile.validateAndThrow(attachments);

    // If attachments are valid and present, upload the files
    if (attachments && attachments.length > 0) {
      // Upload files to disk and generate the file metadata
      uploadedFiles = uploadFilesToDisk(attachments);
      try {
        return await this.documentService.createOrReplaceDocument(
          createDocumentDto,
          uploadedFiles,
        );
      } catch (error) {
        this.handleDocumentsFileDeletion(uploadedFiles);
        throw error;
      }
    } else {
      throw new BadRequestException('No files were uploaded.');
    }
  }

  // View a specific document file inline by its ID
  @Get('view/:documentId')
  @ApiOperation({ summary: 'View a specific document file by its ID' })
  async viewDocumentFile(@Param('documentId') documentId: string, @Res() res: Response) {
    if (!documentId) {
      throw new BadRequestException('Document ID is required.');
    }
    return this.documentService.viewDocumentFile(documentId, res);
  }

  // Retrieve all documents for a specific application by application ID
  @Get('application/:applicationId')
  @ApiOperation({ summary: 'Retrieve all documents for a specific application' })
  async getDocumentsByApplication(
    @Param('applicationId') applicationId: string,
    @Query('includeArchived') includeArchived: boolean = false,) {
    if (!applicationId) {
      throw new BadRequestException('Application ID is required.');
    }
    return this.documentService.getDocumentsByApplication(applicationId, includeArchived);
  }

  // Retrieve all documents for a specific company by company ID
  @Get('company/:companyId')
  @ApiOperation({ summary: 'Retrieve all documents for a specific company' })
  async getDocumentsByCompany(
    @Param('companyId') companyId: string,
    @Query('includeArchived') includeArchived: boolean = false,
  ) {
    if (!companyId) {
      throw new BadRequestException('Company ID is required.');
    }
    return this.documentService.getDocumentsByCompany(companyId, includeArchived);
  }

  // Admin validates a document
  @Post('validate')
  @ApiOperation({ summary: 'Admin validates the uploaded document' })
  async validateDocument(@Body() validateDocumentDto: ValidateDocumentDto) {
    return this.documentService.validateDocument(
      validateDocumentDto.documentId,
      validateDocumentDto.isValid,
      validateDocumentDto.validationNotes,
    );
  }

  // Retrieve documents by type for a specific application
  @Get('application/:applicationId/type/:documentType')
  @ApiOperation({ summary: 'Retrieve documents by type for a specific application' })
  @ApiQuery({ name: 'includeArchived', required: false, type: Boolean, description: 'Include archived documents in the response' })
  async getDocumentsByType(
    @Param('applicationId') applicationId: string,
    @Param('documentType') documentType: string,
    @Query('includeArchived') includeArchived: boolean = false,
  ) {
    if (!applicationId || !documentType) {
      throw new BadRequestException('Application ID and Document Type are required.');
    }
    return this.documentService.getDocumentsByType(applicationId, documentType, includeArchived);
  }

  // Handle the deletion of files if there's an error during upload
  private handleDocumentsFileDeletion(uploadedFiles: UploadResult[]) {
    uploadedFiles.forEach((file) => {
      const filePath = `/uploads/documents/${file.filename}`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Remove the file from the disk
      }
    });
  }
}
