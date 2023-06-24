// This file contains all the types related to the block system
// and the block editor

import { ElementType } from 'react';
import { RecoilState } from 'recoil';

export interface BlockState {
  // The type is used to determine which block corresponds
  // to this node
  blockName: string;
  // Inputs consists of a object, where each key corresponds to the
  // name of the input, and the value is the ids of the children
  inputs: Record<string, string[]>;
  // special case for primitive inputs to store their value there
  value?: string | number;
  id: string;
  parent: string | null;
}

export type InputValue = string | number | null;

interface BlockProps {
  id: string;
  [key: string | number | symbol]: any;
}

export enum InputType {
  block = 'block',
  number = 'number',
  string = 'string',
  root = 'root',
  store = 'store',
  any = 'any',
  object = 'object',
  none = 'none', // input type of none is only valid for things that expect an input type of anything which means a function i think`
  function = 'function',
}

export enum PrimitiveBlocks {
  string = 'string',
  number = 'number',
  object = 'object',
  textarea = 'textarea',
  empty = 'empty',
}

export enum InputCategories {
  layout = 'layout',
  media = 'media',
  interactive = 'interactive',
  values = 'values',
  misc = 'miscellaneous',
}

export interface Input {
  type: InputType[];
  defaultValue?: string | number;
  array?: boolean;
  object?: boolean;
  options?: string[] | ((...any: any) => string[]);
  label: string;
  defaultBlock?: string;
  defaultInputSettings?: Input;
  order: number;
}

export type Block = (props: BlockProps) => any;

export interface BlockEntry<T extends {} = {}> {
  block: Block;
  inputsSettings: { [key in keyof T]: Input };
  hidden?: boolean;
  type: InputType;
  name: string;
  defaultInputSettings?: Input;
  category: string;
}

export type Child = ElementType | number | Function | string | Record<string, any> | null;

export type Children<T = any> = Record<keyof T, Child | Array<Child>>;

export type Setter = <T>(recoilVal: RecoilState<T>, valOrUpdater: ((currVal: T) => T) | T) => void;
