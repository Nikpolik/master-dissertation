import { atom } from 'recoil';

export interface Page {
  id: string;
  pageName: string;
  rootId: string;
  createdAt: number;
  description: string;
}

export interface PagesState {
  pages: Record<string, Page>;
  loading: boolean;
}

const emptyPages: PagesState = {
  pages: {},
  loading: false,
};

const pagesState = atom<PagesState>({
  key: 'PagesState',
  default: emptyPages,
});

export { pagesState };
