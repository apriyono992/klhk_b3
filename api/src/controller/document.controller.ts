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
import { ApiOperation, ApiQuery, ApiTags, ApiResponse } from '@nestjs/swagger';
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

  @Post('upload')
  @ApiOperation({ summary: 'Upload or replace a document for an application' })
  @ApiResponse({
    status: 201,
    description: 'Document uploaded successfully.',
    schema: {
      example: {
        message: 'Document uploaded successfully.',
        documents: [
          {
            applicationId: 'app123',
            fileName: 'document.pdf',
            documentType: 'IMPROPER_HANDLING',
            fileUrl: '/uploads/documents/document.pdf',
            isValid: false,
            isArchived: false,
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 400, description: 'No files were uploaded.' })
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
        return await this.documentService.createOrReplaceDocument(createDocumentDto, uploadedFiles);
      } catch (error) {
        this.handleDocumentsFileDeletion(uploadedFiles);
        throw error;
      }
    } else {
      throw new BadRequestException('No files were uploaded.');
    }
  }

  @Get('view/:documentId')
  @ApiOperation({ summary: 'View a specific document file by its ID' })
  @ApiResponse({
    status: 200,
    description: 'Document viewed inline successfully.',
    schema: {
      example: 'A PDF or image file would be streamed here',
    },
  })
  @ApiResponse({ status: 400, description: 'Document ID is required.' })
  @ApiResponse({ status: 404, description: 'Document not found.' })
  async viewDocumentFile(@Param('documentId') documentId: string, @Res() res: Response) {
    if (!documentId) {
      throw new BadRequestException('Document ID is required.');
    }
    return this.documentService.viewDocumentFile(documentId, res);
  }

  @Get('application/:applicationId')
  @ApiOperation({ summary: 'Retrieve all documents for a specific application' })
  @ApiResponse({
    status: 200,
    description: 'Documents retrieved successfully.',
    schema: {
      example: {
        applicationId: 'app123',
        documents: [
          {
            id: 'doc123',
            fileName: 'document.pdf',
            documentType: 'IMPROPER_HANDLING',
            fileUrl: '/uploads/documents/document.pdf',
            isValid: true,
            isArchived: false,
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Application ID is required.' })
  @ApiResponse({ status: 404, description: 'No documents found for the application.' })
  async getDocumentsByApplication(
    @Param('applicationId') applicationId: string,
    @Query('includeArchived') includeArchived: boolean = false,
  ) {
    if (!applicationId) {
      throw new BadRequestException('Application ID is required.');
    }
    return this.documentService.getDocumentsByApplication(applicationId, includeArchived);
  }

  @Get('company/:companyId')
  @ApiOperation({ summary: 'Retrieve all documents for a specific company' })
  @ApiResponse({
    status: 200,
    description: 'Documents retrieved successfully.',
    schema: {
      example: {
        companyId: 'company123',
        applications: [
          {
            applicationId: 'app123',
            documents: [
              {
                id: 'doc123',
                fileName: 'document.pdf',
                documentType: 'IMPROPER_HANDLING',
                fileUrl: '/uploads/documents/document.pdf',
                isValid: true,
                isArchived: false,
              },
            ],
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Company ID is required.' })
  @ApiResponse({ status: 404, description: 'No applications found for the company.' })
  async getDocumentsByCompany(
    @Param('companyId') companyId: string,
    @Query('includeArchived') includeArchived: boolean = false,
  ) {
    if (!companyId) {
      throw new BadRequestException('Company ID is required.');
    }
    return this.documentService.getDocumentsByCompany(companyId, includeArchived);
  }

  @Post('validate')
  @ApiOperation({ summary: 'Admin validates the uploaded document' })
  @ApiResponse({
    status: 200,
    description: 'Document validated successfully.',
    schema: {
      example: {
        documentId: 'doc123',
        isValid: true,
        validationNotes: 'Valid document',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Document not found.' })
  async validateDocument(@Body() validateDocumentDto: ValidateDocumentDto) {
    return this.documentService.validateDocument(
      validateDocumentDto.documentId,
      validateDocumentDto.isValid,
      validateDocumentDto.validationNotes,
    );
  }

  @Post('validateTelaah')
  @ApiOperation({ summary: 'Admin validates the uploaded document' })
  @ApiResponse({
    status: 200,
    description: 'Document validated successfully.',
    schema: {
      example: {
        documentId: 'doc123',
        isValid: true,
        validationNotes: 'Valid document',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Document not found.' })
  async validateTelaahDocument(@Body() validateDocumentDto: ValidateDocumentDto) {
    return this.documentService.validateTelaahDocument(
      validateDocumentDto.documentId,
      validateDocumentDto.isValid,
      validateDocumentDto.validationNotes,
    );
  }

  @Get('application/:applicationId/type/:documentType')
  @ApiOperation({ summary: 'Retrieve documents by type for a specific application' })
  @ApiQuery({ name: 'includeArchived', required: false, type: Boolean, description: 'Include archived documents in the response' })
  @ApiResponse({
    status: 200,
    description: 'Documents retrieved by type successfully.',
    schema: {
      example: {
        applicationId: 'app123',
        documents: [
          {
            id: 'doc123',
            fileName: 'document.pdf',
            documentType: 'IMPROPER_HANDLING',
            fileUrl: '/uploads/documents/document.pdf',
            isValid: true,
            isArchived: false,
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Application ID and Document Type are required.' })
  @ApiResponse({ status: 404, description: 'No documents found for the application and type.' })
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
