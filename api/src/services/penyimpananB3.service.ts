import * as fs from 'fs';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.services';
import { CreatePenyimpananB3Dto } from 'src/models/createPenyimpananB3Dto';
import { CreateDocumentPenyimpananDto } from 'src/models/createDocumentPenyimpananDto';
import { UploadResult } from 'src/models/uploadResult';
import { getMimeType } from 'src/utils/helpers';
import { Response } from 'express';
import { TipeDokumenPenyimpananB3 } from 'src/models/enums/tipeDokumenPenyimpananB3';
import { StatusPenyimpananB3 } from 'src/models/enums/statusPenyimpananB3';
import { url } from 'inspector';

@Injectable()
export class PenyimpananB3Service {
  constructor(private readonly prisma: PrismaService) {}

  async createPenyimpananB3(createPenyimpananB3Dto: CreatePenyimpananB3Dto) {
    const { companyId, alamatGudang, longitude, latitude, luasArea } = createPenyimpananB3Dto;
    
    const penyimpananB3 = await this.prisma.penyimpananB3.create({
        data: {
          company: { connect: { id: companyId } },
          status: StatusPenyimpananB3.PENDING,
          alamatGudang,
          longitude,
          latitude,
          luasArea,
        },
    });

    // Insert TelaahTeknisDocumentNotesRekomendasiB3 records based on TipeDokumenTelaah enum
    const documentTypes = Object.values(TipeDokumenPenyimpananB3);
    for (const tipeDokumen of documentTypes) {
      try{
        await this.prisma.penyimpananB3Persyaratan.create({
          data: {
            penyimpananB3Id: penyimpananB3.id,
            tipeDokumen: tipeDokumen,
          },
        });
      }catch(error){
        console.log(error);
      }

    }

    return {
        message: 'Penyimpanan B3 created successfully',
    }
  }

  async updatePenyimpananB3(id:string, createPenyimpananB3Dto: CreatePenyimpananB3Dto) {
    const { companyId, alamatGudang, longitude, latitude, luasArea, status } = createPenyimpananB3Dto;
  
    
    const existing = await this.prisma.penyimpananB3.findUnique({ where: { id }, include: {PenyimpananB3Persyaratan: {include:{photosPenyimpananB3:true}}, company: true} });

    if (!existing) {
      throw new NotFoundException(`Penyimpanan B3 with ID ${id} not found`);
    }

    if(existing.company.id !== companyId){
      throw new BadRequestException(`Company ID ${companyId} does not match the existing penyimpanan B3 company ID`);
    }

    if(existing.status === StatusPenyimpananB3.APPROVED){
      throw new BadRequestException(`Penyimpanan B3 with ID ${id} has already been approved`);
    }

    if(existing.status === StatusPenyimpananB3.DELETE){
      throw new NotFoundException(`Penyimpanan B3 with ID ${id} has been deleted`);
    }
    let updatePenyimpananB3Dto:any;

    if(companyId){
      updatePenyimpananB3Dto.companyId = { connect: { id: companyId } };
    }

    if(alamatGudang){
      updatePenyimpananB3Dto.alamatGudang = alamatGudang;
    }
    
    if(longitude){
      updatePenyimpananB3Dto.longitude = longitude;
    }
    
    if(latitude){
      updatePenyimpananB3Dto.latitude = latitude;
    }

    if(luasArea){
      updatePenyimpananB3Dto.luasArea = luasArea;
    }

    if(status){
      if(status === StatusPenyimpananB3.APPROVED && existing.PenyimpananB3Persyaratan.some((item) => !item.isApproved)){
          throw new BadRequestException(`Penyimpanan B3 cannot be approved because some documents are not approved`);
      }

      if(status === StatusPenyimpananB3.REVIEW_BY_ADMIN){
        // Step 1: Extract all the requirements
        const persyaratanList = existing.PenyimpananB3Persyaratan;

        // Step 2: Filter out the requirements where photos are missing
        const missingDocuments = persyaratanList.filter((item) => item.photosPenyimpananB3.length === 0);

        // Step 3: Get a list of missing document types (tipeDokumen)
        const missingTipeDokumen = missingDocuments.map((item) => item.tipeDokumen);

        // Check if there are any missing documents
        const isAnyDocumentMissing = missingTipeDokumen.length > 0;
        if(isAnyDocumentMissing){
          throw new BadRequestException(`Penyimpanan B3 cannot be submited because some documents are missing, missing documents: ${missingDocuments.join(', ')}`);
        }
        updatePenyimpananB3Dto.status = status;
      }

    }

    await this.prisma.penyimpananB3.update({
      where: { id },
      data: updatePenyimpananB3Dto
    });
    return {
        message: 'Penyimpanan B3 updated successfully',
    }
  }

  async uploadDocument(
    dto: CreateDocumentPenyimpananDto,
    uploadedFiles: UploadResult[],
  ) {
    // Fetch the existing PenyimpananB3 along with the related documents and photos
    const penyimpananB3 = await this.prisma.penyimpananB3.findUnique({
      where: { id: dto.penyimpananId },
      include: {
        PenyimpananB3Persyaratan: {
          include: { photosPenyimpananB3: true },
        },
      },
    });
  
    if (!penyimpananB3) {
      throw new NotFoundException(`Penyimpanan B3 with ID ${dto.penyimpananId} not found`);
    }
  
    // Check if the document type already exists for this application
    const existingDocument = await this.prisma.penyimpananB3Persyaratan.findFirst({
      where: {
        penyimpananB3Id: penyimpananB3.id,
        tipeDokumen: dto.documentType,
      },
      include: { photosPenyimpananB3: true },
    });
  
    // If no existing document is found, throw an error
    if (!existingDocument) {
      throw new NotFoundException(`Document type ${dto.documentType} not found for this Penyimpanan B3`);
    }
  
    // Insert the new photos without deleting the old ones
    const savedDocuments = await Promise.all(
      uploadedFiles.map((file) =>
        this.prisma.photoPenyimpananB3.create({
          data: {
            penyimpananB3Persyaratan: { connect: { id: existingDocument.id } },
            originalFileName: file.originalname,
            fileName: file.filename,
            fileUrl: file.path, // Save the new file path
          },
        }),
      ),
    );
  
    return {
      message: 'New photos added successfully to the existing document',
    };
  }

  async deletePhotos(photoIds: string[]) {
    // Step 1: Fetch the photos from the database
    const photos = await this.prisma.photoPenyimpananB3.findMany({
      where: { id: { in: photoIds } },
    });

    if (photos.length === 0) {
      throw new NotFoundException(`No photos found for the provided IDs`);
    } 

    for (const photo of photos) {
      if (fs.existsSync(photo.fileUrl)) {
        try {
          fs.unlinkSync(photo.fileUrl); // Remove the old file from disk
        } catch (err) {
          throw new NotFoundException(`Failed to delete old document from disk`);
        }
      }
    }

    // Step 3: Delete the photo records from the database
    await this.prisma.photoPenyimpananB3.deleteMany({
      where: { id: { in: photoIds } },
    });

    return {
      message: 'Photos deleted successfully',
      deletedPhotoIds: photoIds,
    };
  }


  async getPenyimpananB3(id: string) {
    // Fetch data with Prisma query
    const penyimpananB3 = await this.prisma.penyimpananB3.findUnique({
      where: { id },
      include: {
        PenyimpananB3Persyaratan: {
          include: {
            photosPenyimpananB3: true,
          },
        },
        company: true,
      },
    });
  
    // Check if data exists
    if (!penyimpananB3) {
      throw new NotFoundException(`Penyimpanan B3 with ID ${id} not found`);
    }
  
    // Update file URLs for each photo
    penyimpananB3.PenyimpananB3Persyaratan.forEach((document) => {
      document.photosPenyimpananB3.forEach((photo) => {
        photo.fileUrl = `${photo.fileUrl}`;
      });
    });
  
    // Return the updated data
    return {
      penyimpananB3,
    };
  }
  
  
  // View a document file inline
  async viewDocumentFile(id: string, res: Response) {
    const document = await this.prisma.photoPenyimpananB3.findUnique({
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

  // List active or archived documents for a specific company by application or company ID
  async getDocumentsByCompany(companyId: string) {
      const penyimpananB3 = await this.prisma.penyimpananB3.findMany({
          where: { companyId: companyId },
          include: {
            PenyimpananB3Persyaratan: {include: {photosPenyimpananB3: true}}
          },
      });

      return {
          penyimpananB3
      };
  }
  
  // Validate a document by an admin
  async validateDocument(penyimpananB3Persyaratan: string, isValid: boolean, validationNotes?: string, userId?: string) {
        const document = await this.prisma.penyimpananB3Persyaratan.findUnique({
          where: { id: penyimpananB3Persyaratan },
        });
    
        if (!document) {
          throw new NotFoundException(`Document with ID ${penyimpananB3Persyaratan} not found`);
        }
    
        return this.prisma.penyimpananB3Persyaratan.update({
          where: { id: penyimpananB3Persyaratan },
          data: {
            isApproved: isValid,
            notes: validationNotes,
            approval:{
                upsert:{
                    create:{
                      approvedBy: {connect: {id: userId}},
                      approvedAt: new Date(),
                    },
                    update:{
                        approvedAt: new Date(),
                        approvedBy: {connect: {id: userId}},
                }
            }
          },
        }});
  }

  // Validate a document by an admin
  async validatePenyimpanan(penyimpananB3Id: string, isValid: boolean,  status: StatusPenyimpananB3, userId?: string) {
      const penyimpananB3 = await this.prisma.penyimpananB3.findUnique({
        where: { id: penyimpananB3Id },
        include: {PenyimpananB3Persyaratan: true}
      });

      if (!penyimpananB3) {
        throw new NotFoundException(`Penyimpanan B3 with ID ${penyimpananB3Id} not found`);
      }

      if(status === StatusPenyimpananB3.APPROVED && penyimpananB3.PenyimpananB3Persyaratan.some((item) => !item.isApproved)){
        throw new BadRequestException(`Penyimpanan B3 cannot be approved because some documents are not approved`);
    }

      return this.prisma.penyimpananB3.update({
        where: { id: penyimpananB3Id },
        data: {
          isApproved: isValid,
          status: status,
          approval:{
              upsert:{
                  create:{
                    approvedBy: {connect: {id: userId}},
                    approvedAt: new Date(),
                  },
                  update:{
                      approvedAt: new Date(),
                      approvedBy: {connect: {id: userId}},
              }
          }
        },
      }});
  }
}
