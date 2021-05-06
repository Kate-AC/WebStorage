import { createStore } from 'redux';

type Action = {
  type: string;
  message: string;
}

type State = {
  type: string;
  message: string;
}

export const alertStore = createStore((
  state: State = { type: '', message: '' },
  action: Action,
): State => {
  switch (action.type) {
    case 'SUCCESS':
      state = {
        type: 'success',
        message: action.message,
      };
      break;
    case 'ERROR':
      state = {
        type: 'danger',
        message: action.message,
      };
      break;
    case 'WARNING':
      state = {
        type: 'warning',
        message: action.message,
      };
      break;
    case 'INFO':
      state = {
        type: 'primary',
        message: action.message,
      };
      break;
  }

  return state;
});
