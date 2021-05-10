import { jest } from '@jest/globals';
import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

jest.useFakeTimers();
Enzyme.configure({ adapter: new Adapter() });
