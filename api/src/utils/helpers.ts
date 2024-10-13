import { extname } from "path";

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