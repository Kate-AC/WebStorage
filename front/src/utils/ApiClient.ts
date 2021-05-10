import axios from 'axios';
import { alertStore } from 'store/index';
import { sortCreatedAtDesc } from 'utils/FileSorter';
import { UploadedFile } from 'types/UploadedFile';
import { AnalyzedFile } from 'types/AnalyzedFile';

export function executeTest (): void {
  axios.defaults.withCredentials = true;

  axios
    .post(process.env.NEXT_PUBLIC_BACKEND_URL + '/test', {})
    .then((response) => {
      console.log(response);
      console.log('OK');
    })
    .catch((response) => {
      console.log('NG');
    });
}

export function executeLogin (): void {
  axios.defaults.withCredentials = true;

  axios
    .post(process.env.NEXT_PUBLIC_BACKEND_URL + '/login', {})
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
    .post(process.env.NEXT_PUBLIC_BACKEND_URL + '/show_files')
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
        process.env.NEXT_PUBLIC_BACKEND_URL + '/upload_file',
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
      .post(process.env.NEXT_PUBLIC_BACKEND_URL + '/download_file', {
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
      .post(process.env.NEXT_PUBLIC_BACKEND_URL + '/operate_files', {
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
      .get(process.env.NEXT_PUBLIC_BACKEND_URL + '/authorization', {})
      .then((response) => {
        console.log(response.status);
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
        console.log(response);
        alertStore.dispatch({
          type: 'INFO',
          message: 'INFO: Please login again.',
        });
        resolve(false);
      });
  });
}
