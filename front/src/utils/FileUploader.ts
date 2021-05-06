import { executeUploadFile } from 'utils/ApiClient';
import { AnalyzedFile } from 'types/AnalyzedFile';
import { UploadedFile } from 'types/UploadedFile';

export default class FileUploader {
  files: FileList;
  analyzedFiles: AnalyzedFile[];
  uploadedFiles: UploadedFile[];
  maxExecutionNumber: number;

  static get DIVISION_SIZE (): number {
    // 4MB
    return 1024 * 1000 * 4;
  }

  constructor (files: FileList) {
    this.files = files;
    this.analyzedFiles = [];
    this.uploadedFiles = [];
    this.maxExecutionNumber = 0;
  }

  async analyze (): Promise<boolean> {
    for (const file of this.files) {
      const data: string = await this.read(file);
      const divisionNumber: number = Math.ceil(data.length / FileUploader.DIVISION_SIZE);
      const dataSet: string[] = [];

      for (let i = 0; i < divisionNumber; i++) {
        dataSet.push(
          data.slice(i * FileUploader.DIVISION_SIZE, (i + 1) * FileUploader.DIVISION_SIZE),
        );
      }

      this.maxExecutionNumber += divisionNumber;

      this.analyzedFiles.push({
        dataSet: dataSet,
        fileKey: btoa(String(Math.random() * 1000000 + Date.now())),
        fileName: file.name,
        fileSize: data.length,
        divisionNumber: divisionNumber,
        executionCount: 0,
        status: 'initialized',
        transferInitialized: function () {
          this.status = 'initialized';
        },
        transferRunning: function () {
          this.status = 'running';
        },
        transferCompleted: function () {
          this.status = 'completed';
        },
        progress: function () {
          return (this.executionCount / this.divisionNumber) * 100;
        },
      });
    }

    return true;
  }

  read (file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileReader: FileReader = new FileReader();

      fileReader.onload = () => {
        resolve(btoa(String(fileReader.result)));
      };

      fileReader.onerror = () => {
        throw fileReader.error;
      };

      fileReader.readAsBinaryString(file);
    });
  }

  popUploadedFile (): UploadedFile | null {
    if (this.uploadedFiles.length < 1) {
      return null;
    }

    return this.uploadedFiles.shift()!;
  }

  progress (): number {
    return (
      this.analyzedFiles.reduce((value, analyzedFile) => {
        return value + analyzedFile.executionCount;
      }, 0) / this.maxExecutionNumber * 100
    );
  }

  running (): boolean {
    return this.progress() !== 0;
  }

  completed (): boolean {
    return this.progress() === 100;
  }

  clear (): void {
    this.analyzedFiles = [];
  }

  getMaxExecutionNumber (): number {
    return this.maxExecutionNumber;
  }

  getAnalyzedFiles (): AnalyzedFile[] {
    return this.analyzedFiles;
  }

  async bulkUpload (): Promise<void> {
    for (const analyzedFile of this.analyzedFiles) {
      await this.upload(analyzedFile);
    }
  }

  async upload (analyzedFile: AnalyzedFile): Promise<boolean> {
    analyzedFile.transferRunning();

    for (let i = 0; i < analyzedFile.dataSet.length; i++) {
      const uploadedFile: UploadedFile = await executeUploadFile(analyzedFile, i);
      analyzedFile.executionCount += 1;

      if (Object.keys(uploadedFile).length > 0) {
        this.uploadedFiles.push(uploadedFile);
      }
    }

    analyzedFile.transferCompleted();
    return true;
  }
}
