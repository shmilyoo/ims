import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { required } from './forms/validate';

// it('renders without crashing', () => {
//   const div = document.createElement('div');
//   ReactDOM.render(<App />, div);
// });

it('check required', () => {
  expect(required(NaN)).toEqual('不能为空');
  expect(required(undefined)).toEqual('不能为空');
  expect(required(null)).toEqual('不能为空');
  expect(required(' ')).toEqual('不能为空');
  expect(required('')).toEqual('不能为空');
  expect(required({})).toEqual('不能为空');
  expect(required([])).toEqual('不能为空');
  expect(required(0)).toEqual(undefined);
  expect(required('1')).toEqual(undefined);
  expect(required({ a: 1, b: 2 })).toEqual(undefined);
});
