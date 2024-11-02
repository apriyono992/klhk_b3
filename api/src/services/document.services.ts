import * as fs from 'fs';
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from './prisma.services';
import { CreateDocumentDto } from 'src/models/createDocumentDto';
import { UploadResult } from 'src/models/uploadResult';
import { getMimeType } from 'src/utils/helpers';
import { RequiredDocumentsStatus } from 'src/models/types/tipeDokumen';
import { ValidateDocumentDto } from 'src/models/validateDocumentDto';

@Injectable()
export class DocumentService {
  constructor(private readonly prisma: PrismaService) {}

  // Save or replace a document for an application (with re-upload and history support)
  async createOrReplaceDocument(
    createDocumentDto: CreateDocumentDto,
    uploadedFiles: UploadResult[],
  ) {
    // Check if the application exists
    const application = await this.prisma.application.findUnique({
      where: { id: createDocumentDto.applicationId },
    });

    if (!application) {
      throw new NotFoundException(`Application with ID ${createDocumentDto.applicationId} not found`);
    }

    // Safely parse requiredDocumentsStatus as an object
    let requiredDocumentsStatus: RequiredDocumentsStatus;
    if (application.requiredDocumentsStatus) {
      requiredDocumentsStatus = application.requiredDocumentsStatus as RequiredDocumentsStatus;
    } else {
      requiredDocumentsStatus = {} as RequiredDocumentsStatus;
    }

    // Check if the document type already exists for this application
    const existingDocument = await this.prisma.documentRekomendasiB3.findFirst({
      where: {
        applicationId: createDocumentDto.applicationId,
        documentType: createDocumentDto.documentType,
        isArchived: false, // Only find active documents
      },
    });

    // If an existing document is found, archive it and delete the file from disk
    if (existingDocument) {
      await this.prisma.documentRekomendasiB3.update({
        where: { id: existingDocument.id },
        data: { isArchived: true }, // Archive the document
      });

      if (fs.existsSync(existingDocument.fileUrl)) {
        try {
          fs.unlinkSync(existingDocument.fileUrl); // Remove the old file from disk
        } catch (err) {
          throw new NotFoundException(`Failed to delete old document from disk: ${err.message}`);
        }
      }
    }

    // Insert the new document
    const savedDocuments = await Promise.all(
      uploadedFiles.map((file) =>
        this.prisma.documentRekomendasiB3.create({
          data: {
            applicationId: createDocumentDto.applicationId,
            fileName: file.originalname,
            documentType: createDocumentDto.documentType,
            fileUrl: file.path, // Save the new file path
            isValid: false, // Default to false until validated by admin
            isArchived: false, // New document is not archived
          },
        }),
      )
    );

    // Update the requiredDocumentsStatus in the application
    const updatedRequiredDocumentsStatus: RequiredDocumentsStatus = {
      ...requiredDocumentsStatus, // Spread the existing status
      [createDocumentDto.documentType]: true, // Mark the document type as uploaded
    };

    await this.prisma.application.update({
      where: { id: createDocumentDto.applicationId },
      data: {
        requiredDocumentsStatus: updatedRequiredDocumentsStatus,
      },
    });

    return {
      message: 'Document replaced successfully',
      documents: savedDocuments,
    };
  }

  // View a document file inline
  async viewDocumentFile(id: string, res: Response) {
    const document = await this.prisma.documentRekomendasiB3.findUnique({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    const filePath = document.fileUrl;

    // Check if file exists on disk
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`File not found on disk at path: ${filePath}`);
    }

    // Get file extension and set the appropriate MIME type
    const mimeType = getMimeType(filePath);

    // Set headers for inline display
    res.set({
      'Content-Type': mimeType,
      'Content-Disposition': `inline; filename="${document.fileName}"`,
    });

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }

  // List active or archived documents for a specific application
  async getDocumentsByApplication(applicationId: string, includeArchived: boolean) {
    const documents = await this.prisma.documentRekomendasiB3.findMany({
      where: {
        applicationId,
        isArchived: includeArchived ? undefined : false, // If includeArchived is true, ignore the archive filter
      },
    });

    if (documents.length === 0) {
      throw new NotFoundException(`No documents found for Application ID ${applicationId}`);
    }

    return documents;
  }

  // List active or archived documents for a specific company by application or company ID
  async getDocumentsByCompany(companyId: string, includeArchived: boolean) {
    const applications = await this.prisma.application.findMany({
      where: { companyId },
      include: {
        documents: {
          where: {
            isArchived: includeArchived ? undefined : false, // If includeArchived is true, ignore the archive filter
          },
        },
      },
    });

    if (applications.length === 0) {
      throw new NotFoundException(`No applications found for Company ID ${companyId}`);
    }

    const allDocuments = applications.map((application) => ({
      applicationId: application.id,
      documents: application.documents,
    }));

    return {
      companyId,
      applications: allDocuments,
    };
  }

  // Validate a document by an admin
  async validateDocument(documentId: string, isValid: boolean, validationNotes?: string) {
    const document = await this.prisma.documentRekomendasiB3.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${documentId} not found`);
    }

    return this.prisma.documentRekomendasiB3.update({
      where: { id: documentId },
      data: {
        isValid: isValid,
        validationNotes: validationNotes,
      },
    });
  }

   // Validate a document by an admin
   async validateTelaahDocument(documentId: string, isValid: boolean, validationNotes?: string) {
    const document = await this.prisma.documentRekomendasiB3.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${documentId} not found`);
    }

    return this.prisma.documentRekomendasiB3.update({
      where: { id: documentId },
      data: {
        isValidTelaah : isValid,
        telaahNotes: validationNotes,
      },
    });
  }

  // Retrieve a document by type for a specific application
  async getDocumentsByType(applicationId: string, documentType: string, includeArchived: boolean = false) {
  const documents = await this.prisma.documentRekomendasiB3.findMany({
    where: {
      applicationId,
      documentType,
      isArchived: includeArchived ? undefined : false, // Filter out archived documents unless includeArchived is true
    },
  });

  if (documents.length === 0) {
    throw new NotFoundException(`No documents found for Application ID ${applicationId} and Document Type ${documentType}`);
  }

  return documents;
  }
}
