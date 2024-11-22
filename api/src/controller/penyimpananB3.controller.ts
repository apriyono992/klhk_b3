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
    Put,
    Delete,
    UseGuards,
  } from '@nestjs/common';
  import { FilesInterceptor } from '@nestjs/platform-express';
  import { ApiOperation, ApiQuery, ApiTags, ApiResponse, ApiBody, ApiConsumes, ApiParam } from '@nestjs/swagger';
  import { Response } from 'express';
  import { CreateDocumentDto } from 'src/models/createDocumentDto';
  import { ValidateDocumentDto } from 'src/models/validateDocumentDto';
  import { UploadResult } from 'src/models/uploadResult';
  import { DocumentService } from 'src/services/document.services';
  import { uploadFilesToDisk } from 'src/utils/uploadDocumentFileToDisk';
  import { IsDocumentValidFile } from 'src/validators/documentFileType.validator';
  import * as fs from 'fs';
  import { ValidateTelaahDocumentDto } from 'src/models/validateDocumentTelaahDto';
import { PenyimpananB3Service } from 'src/services/penyimpananB3.service';
import { IsPhotoValidFile } from 'src/validators/photoFileType.validator';
import { uploadPhotoFilesToDisk } from 'src/utils/uploadPhotoFileToDisk';
import { CreateDocumentPenyimpananDto } from 'src/models/createDocumentPenyimpananDto';
import { CreatePenyimpananB3Dto } from 'src/models/createPenyimpananB3Dto';
import { DeletePhotosDto } from 'src/models/deletePhotosDto';
import { ValidatePenyimpananDto } from 'src/models/validatePenyimpananB3Dto';
import { ValidateDocumentPenyimpananDto } from 'src/models/validateDocumentPenyimpananDto';
import { TipeDokumenPenyimpananB3 } from 'src/models/enums/tipeDokumenPenyimpananB3';
import { SearchPenyimpananB3Dto } from 'src/models/searchPenyimpananB3Dto';
import { RolesGuard } from 'src/utils/roles.guard';
import { JwtAuthGuard } from 'src/utils/auth.guard';
import { RolesAccess } from 'src/models/enums/roles';
import { Roles } from 'src/utils/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
  @ApiTags('PenyimpananB3')
  @Controller('penyimpananB3')
  export class PenyimpananB3Controller {
    constructor(
      private readonly penyimpananB3Service: PenyimpananB3Service,
      private readonly isPhotoValidFile: IsPhotoValidFile,
    ) {}

    @Roles(RolesAccess.PIC_PELAPORAN, RolesAccess.PENGELOLA, RolesAccess.SUPER_ADMIN)
    @Post('create')
    @ApiOperation({ summary: 'Create a new Penyimpanan B3' })
    @ApiBody({
      description: 'Data for creating Penyimpanan B3',
      type: CreatePenyimpananB3Dto,
      examples: {
        example1: {
          summary: 'Sample Request',
          value: {
            companyId: '12345',
            alamatGudang: 'Jl. Industri No. 10, Jakarta',
            longitude: 106.84513,
            latitude: -6.20876,
            luasArea: 500.0,
          },
        },
      },
    })
    @ApiResponse({
      status: 201,
      description: 'Penyimpanan B3 created successfully',
      schema: {
        example: {
          message: 'Penyimpanan B3 created successfully',
        },
      },
    })
    @ApiResponse({
      status: 400,
      description: 'Bad Request',
      schema: {
        example: {
          statusCode: 400,
          message: 'Validation failed (e.g., companyId is missing or invalid)',
          error: 'Bad Request',
        },
      },
    })
    @ApiResponse({
      status: 404,
      description: 'Company not found',
      schema: {
        example: {
          statusCode: 404,
          message: 'Company with ID 12345 not found',
          error: 'Not Found',
        },
      },
    })
    async createPenyimpananB3(@Body() createPenyimpananB3Dto: CreatePenyimpananB3Dto) {
      return await this.penyimpananB3Service.createPenyimpananB3(createPenyimpananB3Dto);
    }
    
    @Roles(RolesAccess.PIC_PELAPORAN, RolesAccess.PENGELOLA, RolesAccess.SUPER_ADMIN)
    @Post('upload')
    @UseInterceptors(FilesInterceptor('photos'))
    @ApiOperation({ summary: 'Upload documents for Penyimpanan B3' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      description: 'Upload files with document metadata',
      schema: {
        type: 'object',
        properties: {
          documentType: {
            type: 'string',
            enum: Object.values(TipeDokumenPenyimpananB3),
            example: 'Papan Nama Gudang',
            description: 'The type of document being uploaded',
          },
          penyimpananId: {
            type: 'string',
            example: '12345',
            description: 'ID of the Penyimpanan B3',
          },
          photos: {
            type: 'array',
            items: {
              type: 'string',
              format: 'binary',
            },
            description: 'Array of files to be uploaded',
          },
        },
      },
    })
    @ApiResponse({
      status: 201,
      description: 'Documents uploaded successfully',
      schema: {
        example: {
          message: 'New photos added successfully to the existing document',
        },
      },
    })
    @ApiResponse({
      status: 400,
      description: 'Bad Request',
      schema: {
        example: {
          statusCode: 400,
          message: 'No files were uploaded.',
          error: 'Bad Request',
        },
      },
    })
    @ApiResponse({
      status: 404,
      description: 'Not Found',
      schema: {
        example: {
          statusCode: 404,
          message: 'Penyimpanan B3 with ID 12345 not found',
          error: 'Not Found',
        },
      },
    })
    async uploadDocuments(
      @UploadedFiles() photos: Express.Multer.File[],
      @Body() createDocumentDto: CreateDocumentPenyimpananDto,
    ) {
      let uploadedFiles: UploadResult[] = [];
  
      // Validate the files
      this.isPhotoValidFile.validateAndThrow(photos);
  
      // If attachments are valid and present, upload the files
      if (photos && photos.length > 0) {
        // Upload files to disk and generate the file metadata
        uploadedFiles = uploadPhotoFilesToDisk(photos);
        try {
          return await this.penyimpananB3Service.uploadDocument(createDocumentDto, uploadedFiles);
        } catch (error) {
          this.handleDocumentsFileDeletion(uploadedFiles);
          throw error;
        }
      } else {
        throw new BadRequestException('No files were uploaded.');
      }
    }

    @Roles(RolesAccess.PIC_PELAPORAN, RolesAccess.PENGELOLA, RolesAccess.SUPER_ADMIN)
    @Put(':id')
    @ApiOperation({ summary: 'Update an existing Penyimpanan B3 record' })
    @ApiParam({ name: 'id', description: 'ID of the Penyimpanan B3 to update', example: '12345' })
    @ApiBody({
      description: 'Data for updating Penyimpanan B3',
      type: CreatePenyimpananB3Dto,
      examples: {
        example1: {
          summary: 'Sample Request',
          value: {
            companyId: '12345',
            alamatGudang: 'Jl. Industri No. 20, Jakarta',
            longitude: 106.84513,
            latitude: -6.20876,
            luasArea: 750.0,
            status: 'REVIEW_BY_ADMIN',
          },
        },
      },
    })
    @ApiResponse({
      status: 200,
      description: 'Penyimpanan B3 updated successfully',
      schema: {
        example: {
          message: 'Penyimpanan B3 updated successfully',
        },
      },
    })
    @ApiResponse({
      status: 400,
      description: 'Bad Request',
      schema: {
        example: {
          statusCode: 400,
          message: 'Validation failed (e.g., status cannot be approved if documents are not approved)',
          error: 'Bad Request',
        },
      },
    })
    @ApiResponse({
      status: 404,
      description: 'Not Found',
      schema: {
        example: {
          statusCode: 404,
          message: 'Penyimpanan B3 with ID 12345 not found',
          error: 'Not Found',
        },
      },
    })
    async updatePenyimpananB3(@Param('id') id: string, @Body() dto: CreatePenyimpananB3Dto) {
      return this.penyimpananB3Service.updatePenyimpananB3(id, dto);
    }
    @Get('view/:documentId')
    @ApiOperation({ summary: 'View a specific document file by its ID' })
    @ApiParam({
      name: 'documentId',
      description: 'The ID of the document file to view',
      example: '12345',
    })
    @ApiResponse({
      status: 200,
      description: 'The document file is streamed inline successfully.',
      content: {
        'application/pdf': {
          schema: {
            type: 'string',
            format: 'binary',
            example: 'PDF or image file content streamed here',
          },
        },
        'image/jpeg': {
          schema: {
            type: 'string',
            format: 'binary',
            example: 'JPEG image content streamed here',
          },
        },
      },
    })
    @ApiResponse({
      status: 400,
      description: 'Bad Request - Document ID is required.',
      schema: {
        example: {
          statusCode: 400,
          message: 'Document ID is required.',
          error: 'Bad Request',
        },
      },
    })
    @ApiResponse({
      status: 404,
      description: 'Not Found - Document or file not found.',
      schema: {
        example: {
          statusCode: 404,
          message: 'Document with ID 12345 not found',
          error: 'Not Found',
        },
      },
    })
    async viewDocumentFile(@Param('documentId') documentId: string, @Res() res: Response) {
      if (!documentId) {
        throw new BadRequestException('Document ID is required.');
      }
      return this.penyimpananB3Service.viewDocumentFile(documentId, res);
    }

    @Roles(RolesAccess.PIC_PELAPORAN, RolesAccess.PENGELOLA, RolesAccess.SUPER_ADMIN)
    @Delete('delete-document')
    @ApiOperation({ summary: 'Delete photos associated with Penyimpanan B3 documents' })
    @ApiBody({
      description: 'List of photo IDs to delete',
      type: DeletePhotosDto,
      examples: {
        example1: {
          summary: 'Sample Request',
          value: {
            photoIds: [
              'photoId1',
              'photoId2',
              'photoId3',
            ],
          },
        },
      },
    })
    @ApiResponse({
      status: 200,
      description: 'Photos deleted successfully',
      schema: {
        example: {
          message: 'Photos deleted successfully',
          deletedPhotoIds: ['photoId1', 'photoId2', 'photoId3'],
        },
      },
    })
    @ApiResponse({
      status: 400,
      description: 'Bad Request - Invalid or missing photo IDs',
      schema: {
        example: {
          statusCode: 400,
          message: 'Invalid photo IDs',
          error: 'Bad Request',
        },
      },
    })
    @ApiResponse({
      status: 404,
      description: 'Not Found - One or more photos were not found',
      schema: {
        example: {
          statusCode: 404,
          message: 'No photos found for the provided IDs',
          error: 'Not Found',
        },
      },
    })
    async deletePhotos(@Body() dto: DeletePhotosDto) {
      return this.penyimpananB3Service.deletePhotos(dto.photoIds);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get details of a specific Penyimpanan B3 by ID' })
    @ApiParam({
      name: 'id',
      description: 'ID of the Penyimpanan B3 to retrieve',
      example: '12345',
    })
    @ApiResponse({
      status: 200,
      description: 'Details of the Penyimpanan B3 retrieved successfully',
      schema: {
        example: {
          penyimpananB3: {
            id: '12345',
            alamatGudang: 'Jl. Industri No. 10, Jakarta',
            longitude: 106.84513,
            latitude: -6.20876,
            luasArea: 500.0,
            status: 'PENDING',
            company: {
              id: 'company123',
              name: 'PT. Example Company',
            },
            PenyimpananB3Persyaratan: [
              {
                id: 'persyaratan1',
                tipeDokumen: 'Papan Nama Gudang',
                notes: 'Verified',
                isApproved: true,
                photosPenyimpananB3: [
                  {
                    id: 'photo1',
                    fileUrl: 'https://api.example.com/uploads/photo1.jpg',
                    originalFileName: 'photo1.jpg',
                  },
                  {
                    id: 'photo2',
                    fileUrl: 'https://api.example.com/uploads/photo2.jpg',
                    originalFileName: 'photo2.jpg',
                  },
                ],
              },
            ],
          },
        },
      },
    })
    @ApiResponse({
      status: 404,
      description: 'Not Found - Penyimpanan B3 with the specified ID was not found',
      schema: {
        example: {
          statusCode: 404,
          message: 'Penyimpanan B3 with ID 12345 not found',
          error: 'Not Found',
        },
      },
    })
    async getPenyimpananB3(@Param('id') id: string) {
      return this.penyimpananB3Service.getPenyimpananB3(id);
    }

  @Get('company/:companyId')
  @ApiOperation({ summary: 'Get all documents for a specific company by Company ID' })
  @ApiParam({
    name: 'companyId',
    description: 'The ID of the company to retrieve documents for',
    example: 'company123',
  })
  @ApiResponse({
    status: 200,
    description: 'List of documents associated with the specified company',
    schema: {
      example: {
        penyimpananB3: [
          {
            id: '12345',
            alamatGudang: 'Jl. Industri No. 10, Jakarta',
            longitude: 106.84513,
            latitude: -6.20876,
            luasArea: 500.0,
            status: 'PENDING',
            PenyimpananB3Persyaratan: [
              {
                id: 'persyaratan1',
                tipeDokumen: 'Papan Nama Gudang',
                notes: 'Verified',
                isApproved: true,
                photosPenyimpananB3: [
                  {
                    id: 'photo1',
                    fileUrl: 'https://api.example.com/uploads/photo1.jpg',
                    originalFileName: 'photo1.jpg',
                  },
                  {
                    id: 'photo2',
                    fileUrl: 'https://api.example.com/uploads/photo2.jpg',
                    originalFileName: 'photo2.jpg',
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Company ID is required',
    schema: {
      example: {
        statusCode: 400,
        message: 'Company ID is required.',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - No documents found for the specified company ID',
    schema: {
      example: {
        statusCode: 404,
        message: 'No documents found for company ID company123',
        error: 'Not Found',
      },
    },
  })
  async getDocumentsByCompany(@Param('companyId') companyId: string) {
    if (!companyId) {
      throw new BadRequestException('Company ID is required.');
    }
    return this.penyimpananB3Service.getDocumentsByCompany(companyId);
  }
  
  @Post('validate-document')
  @ApiOperation({ summary: 'Admin validates the uploaded document' })
  @ApiBody({
    description: 'Payload for validating a document',
    type: ValidateDocumentPenyimpananDto,
    examples: {
      example1: {
        summary: 'Sample Request',
        value: {
          penyimpananB3PersyaratanId: 'doc123',
          isValid: true,
          validationNotes: 'Document looks good',
          userId: 'admin123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Document validated successfully',
    schema: {
      example: {
        id: 'doc123',
        isApproved: true,
        notes: 'Document looks good',
        approval: {
          approvedById: 'admin123',
          approvedAt: '2024-11-08T10:00:00Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Document not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Document with ID doc123 not found',
        error: 'Not Found',
      },
    },
  })
  async validateDocument(@Body() dto: ValidateDocumentPenyimpananDto) {
    return this.penyimpananB3Service.validateDocument(
      dto.penyimpananB3PersyaratanId,
      dto.isValid,
      dto.validationNotes,
      dto.userId,
    );
  }
  
  @Post('validate-penyimpanan')
  @ApiOperation({ summary: 'Admin validates the Penyimpanan B3' })
  @ApiBody({
    description: 'Payload for validating a Penyimpanan B3',
    type: ValidatePenyimpananDto,
    examples: {
      example1: {
        summary: 'Sample Request',
        value: {
          penyimpananB3Id: 'penyimpanan123',
          isValid: true,
          status: 'APPROVED',
          userId: 'admin123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Penyimpanan B3 validated successfully',
    schema: {
      example: {
        id: 'penyimpanan123',
        isApproved: true,
        status: 'APPROVED',
        approval: {
          approvedById: 'admin123',
          approvedAt: '2024-11-08T10:00:00Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Validation failed or some documents are not approved',
    schema: {
      example: {
        statusCode: 400,
        message: 'Penyimpanan B3 cannot be approved because some documents are not approved',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Penyimpanan B3 not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Penyimpanan B3 with ID penyimpanan123 not found',
        error: 'Not Found',
      },
    },
  })
  async validatePenyimpanan(@Body() dto: ValidatePenyimpananDto) {
    return this.penyimpananB3Service.validatePenyimpanan(
      dto.penyimpananB3Id,
      dto.isValid,
      dto.status,
      dto.userId,
    );
  }

  @Post('search')
  @ApiOperation({
    summary: 'Search Penyimpanan B3 records with filters and pagination',
    description:
      'This endpoint allows searching for Penyimpanan B3 records with optional filters. Supports pagination or fetching all records without pagination using the `includeAll` parameter.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of Penyimpanan B3 records matching the search criteria',
    schema: {
      example: {
        data: [
          {
            id: '12345',
            alamatGudang: 'Jl. Industri No. 10, Jakarta',
            longitude: 106.84513,
            latitude: -6.20876,
            luasArea: 500.0,
            status: 'APPROVED',
            isApproved: true,
            company: {
              id: 'company123',
              name: 'PT. Example Company',
            },
            province: {
              id: 'province123',
              name: 'DKI Jakarta',
            },
            regency: {
              id: 'regency123',
              name: 'Jakarta Pusat',
            },
            district: {
              id: 'district123',
              name: 'Tanah Abang',
            },
            village: {
              id: 'village123',
              name: 'Kampung Bali',
            },
          },
        ],
        totalRecords: 100,
        currentPage: 1,
        totalPages: 10,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid query parameters',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - No records found',
  })
  async searchPenyimpananB3(@Query() query: SearchPenyimpananB3Dto) {
    const result = await this.penyimpananB3Service.searchPenyimpananB3(query);
    return result;

  }

  
  // Handle the deletion of files if there's an error during upload
  private handleDocumentsFileDeletion(uploadedFiles: UploadResult[]) {
    uploadedFiles.forEach((file) => {
      const filePath = `/uploads/photos/${file.filename}`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Remove the file from the disk
      }
    });
  }
}
  