import { SetMetadata } from '@nestjs/common';

// Tambahkan metadata untuk menandai endpoint sebagai public
export const Public = () => SetMetadata('isPublic', true);