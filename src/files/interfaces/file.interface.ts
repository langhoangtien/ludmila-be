import { BaseRepositoryInterface } from '../../base/repositories/base.repository.interface';
import { FileUpload } from '../entities/file.entity';

export interface FileUploadsRepositoryInterface
  extends BaseRepositoryInterface<FileUpload> {}
