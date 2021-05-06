import axios from 'axios';
import { alertStore } from 'store/index';
import { sortCreatedAtDesc } from 'utils/FileSorter';
import { UploadedFile } from 'types/UploadedFile';
import { AnalyzedFile } from 'types/AnalyzedFile';

export function executeLogin (): void {
  axios.defaults.withCredentials = true;

  axios
    .post('http://localhost:60100/login', {})
    .then((response) => {
      alertStore.dispatch({
        type: 'SUCCESS',
        message: 'Login success.',
      });
    })
    .catch((response) => {
      alertStore.dispatch({
        type: 'ERROR',
        message: 'ERROR: Login failed. ' + response.message,
      });
    });
}

export function executeShowFiles (setFiles: (arg1: UploadedFile[]) => void) {
  axios.defaults.withCredentials = true;

  axios
    .post('http://localhost:60100/show_files', {})
    .then((response) => {
      const sortedFiles: UploadedFile[] = sortCreatedAtDesc(response.data);
      setFiles(sortedFiles);
    })
    .catch((response) => {
      alertStore.dispatch({
        type: 'ERROR',
        message: 'ERROR: Files fetching failed.' + response.message,
      });
    });
}

export function executeUploadFile (analyzedFile: AnalyzedFile, i: number): Promise<UploadedFile> {
  axios.defaults.withCredentials = true;

  return new Promise((resolve, reject) => {
    axios
      .post(
        'http://localhost:60100/upload_file',
        {
          contents: analyzedFile.dataSet[i],
          fileKey: analyzedFile.fileKey,
          fileName: analyzedFile.fileName,
          terminus: analyzedFile.divisionNumber === i + 1,
        },
        {
          headers: {
            'content-type': 'multipart/form-data',
          },
        },
      )
      .then((response) => {
        resolve(response.data);
      })
      .catch((response) => {
        alertStore.dispatch({
          type: 'ERROR',
          message: 'ERROR: ' + response.message,
        });
      });
  });
}

export function executeDownloadFile (fileKey: string): Promise<string> {
  axios.defaults.withCredentials = true;

  return new Promise((resolve, reject) => {
    axios
      .post('http://localhost:60100/download_file', {
        fileKey: fileKey,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((response) => {
        alertStore.dispatch({
          type: 'ERROR',
          message: 'ERROR: File fetching failed.' + response.message,
        });
      });
  });
}

export function executeOperateFiles (fileKeys: string[], order: string): Promise<string[]> {
  axios.defaults.withCredentials = true;

  return new Promise((resolve, reject) => {
    axios
      .post('http://localhost:60100/operate_files', {
        fileKeys: fileKeys,
        order: order,
      })
      .then((response) => {
        resolve(response.data.fileKeys);
      })
      .catch((response) => {
        alertStore.dispatch({
          type: 'ERROR',
          message: 'ERROR: ' + response.message,
        });
      });
  });
}

export function executeAuthorization (): Promise<boolean> {
  axios.defaults.withCredentials = true;

  return new Promise((resolve, reject) => {
    axios
      .get('http://localhost:60100/authorization', {})
      .then((response) => {
        if (response.status !== 200) {
          alertStore.dispatch({
            type: 'INFO',
            message: 'INFO: Please login again.',
          });
          resolve(false);
        } else {
          resolve(true);
        }
      })
      .catch((response) => {
        alertStore.dispatch({
          type: 'INFO',
          message: 'INFO: Please login again.',
        });
        resolve(false);
      });
  });
}
