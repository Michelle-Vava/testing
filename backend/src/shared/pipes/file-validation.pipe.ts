import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

/**
 * FileValidationPipe validates uploaded files
 * 
 * Validates:
 * - File size (max 5MB per file)
 * - File type (images only)
 * - File count (max 10 files)
 */
@Injectable()
export class FileValidationPipe implements PipeTransform {
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
  ];
  private readonly maxFiles = 10;

  transform(files: Express.Multer.File | Express.Multer.File[]): Express.Multer.File | Express.Multer.File[] {
    if (!files) {
      throw new BadRequestException('No files provided');
    }

    const fileArray = Array.isArray(files) ? files : [files];

    // Validate file count
    if (fileArray.length > this.maxFiles) {
      throw new BadRequestException(`Maximum ${this.maxFiles} files allowed`);
    }

    // Validate each file
    for (const file of fileArray) {
      // Validate file size
      if (file.size > this.maxFileSize) {
        throw new BadRequestException(
          `File ${file.originalname} exceeds maximum size of 5MB`
        );
      }

      // Validate file type
      if (!this.allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          `File ${file.originalname} has invalid type. Allowed types: JPEG, PNG, WebP, GIF`
        );
      }

      // Validate file name (basic sanitization check)
      if (this.hasDangerousFilename(file.originalname)) {
        throw new BadRequestException(
          `File ${file.originalname} has invalid characters`
        );
      }
    }

    return files;
  }

  /**
   * Check for potentially dangerous filename patterns
   */
  private hasDangerousFilename(filename: string): boolean {
    // Check for path traversal attempts
    if (filename.includes('../') || filename.includes('..\\')) {
      return true;
    }

    // Check for executable extensions
    const dangerousExtensions = [
      '.exe', '.bat', '.cmd', '.sh', '.ps1', '.vbs',
      '.js', '.jar', '.app', '.deb', '.rpm'
    ];

    const lowerFilename = filename.toLowerCase();
    return dangerousExtensions.some(ext => lowerFilename.endsWith(ext));
  }
}
