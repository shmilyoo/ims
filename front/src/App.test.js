import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {
  required,
  checkArrayDuplicated,
  checkFromToDate
} from './forms/validate';
// import { timeFunctions } from './services/utility';

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

it('check array duplicated', () => {
  expect(checkArrayDuplicated(v => v, [1, 2, 3], [4, 5, 6])).toEqual(undefined);
  expect(checkArrayDuplicated(v => v, [1, 2, 3], [3, 5, 6])).toEqual(
    '列表重复'
  );
  expect(
    checkArrayDuplicated(
      v => v.id,
      [{ id: 'a', other: 'b' }, { id: 'b', other: 'c' }],
      [{ id: 'a', other: 'b' }, { id: 'c', other: 'c' }]
    )
  ).toEqual('列表重复');
  expect(
    checkArrayDuplicated(
      v => v.id,
      [{ id: 'a', other: 'b' }, { id: 'b', other: 'c' }],
      [{ id: 'd', other: 'b' }, { id: 'c', other: 'c' }]
    )
  ).toEqual(undefined);
});

it('to should be empty or greater than from', () => {
  expect(checkFromToDate(123456, 123457, true)).toEqual(undefined);
  expect(checkFromToDate(123456, 123454, true)).toEqual(
    '结束时间应为空或者大于开始时间'
  );
  expect(checkFromToDate(123456, undefined, false)).toEqual('结束时间不能为空');
  expect(
    checkFromToDate(new Date(), new Date(new Date().getTime() + 2000), true)
  ).toEqual(undefined);
  expect(
    checkFromToDate(new Date(), new Date(new Date().getTime() - 2000), true)
  ).toEqual('结束时间应为空或者大于开始时间');
});

// it('检查相对时间格式化输出', () => {
//   // expect(timeFunctions.formatRelative(1, 1 + 3600 + 1)).toEqual('1小时前');
// });
