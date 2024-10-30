import { extname } from "path";
import { CreateVehicleDto } from "src/models/createVehicleDto";
import { PrismaService } from "src/services/prisma.services";

  // Helper function to get MIME type based on file extension
  export function getMimeType(filePath: string): string {
    const ext = extname(filePath).toLowerCase();
    switch (ext) {
      case '.pdf':
        return 'application/pdf';
      case '.jpg':
      case '.jpeg':
        return 'image/jpeg';
      case '.png':
        return 'image/png';
      case '.txt':
        return 'text/plain';
      default:
        return 'application/octet-stream'; // Fallback for unknown file types
    }
  }

  // Helper function to check for existing vehicles
  export async function  checkForExistingVehicle(prisma: PrismaService, createVehicleDto: CreateVehicleDto) {
    return await prisma.vehicle.findFirst({
        where: {
            OR: [
                { noPolisi: createVehicleDto.noPolisi },
                { nomorRangka: createVehicleDto.nomorRangka },
                { nomorMesin: createVehicleDto.nomorMesin },
            ],
        },
    });
  }