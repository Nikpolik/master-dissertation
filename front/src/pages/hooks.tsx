import { useAuth } from 'auth/hooks';
import { BlockState, useGetAllInputs, useInitializeInputs } from 'core';
import { StrictMode, useEffect, useRef, useState } from 'react';
import ReactDOM, { Root } from 'react-dom/client';
import { RecoilRoot, useRecoilState } from 'recoil';
import RenderApp from 'render';

import RecoilExporter from 'common/RecoilExporter';
import request, { HttpMethod, useRequest } from 'common/request';

import { pagesState, Page } from './state';

function usePages() {
  const [state, setState] = useRecoilState(pagesState);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      return;
    }
    setState((prev) => ({ ...prev, loading: true }));

    request<Page[]>('pages', HttpMethod.GET, { token })
      .then((response) => {
        if (response.error) {
          throw new Error(response.error);
        }

        if (!response.data) {
          throw new Error('Recieved empty response for pages request');
        }

        const pages = response.data.reduce((prev, next) => {
          prev[next.id] = next;
          return prev;
        }, {} as Record<string, Page>);

        setState({ loading: false, pages });
      })
      .catch((e) => {
        console.error(e);
        setState({ loading: false, pages: {} });
      });
  }, [token, setState]);

  return state;
}

function useCreatePage() {
  const [{ pages }, setPages] = useRecoilState(pagesState);
  const { loading, request } = useRequest('pages', HttpMethod.POST);

  async function createPage(pageName: string, description: string) {
    const response = await request<Page>({ data: { pageName, description } });
    if (!response.data) {
      return false;
    }

    setPages({ pages: { ...pages, [response.data.id]: response.data }, loading: false });
    return true;
  }

  return { createPage, loading };
}

function usePage(id: string): { loading: boolean; page?: Page } {
  const { pages, loading } = usePages();

  return { page: pages[id], loading };
}

function useDeletePage(id: string) {
  const [state, setState] = useRecoilState(pagesState);
  const { loading, request } = useRequest(`pages/${id}`, HttpMethod.DELETE);

  async function deletePage() {
    const response = await request();

    if (response.error) {
      return;
    }

    const newPages = { ...state.pages };
    delete newPages[id];
    setState({ ...state, pages: newPages });
  }

  return { loading, deletePage: deletePage };
}

function useFetchPage(id: string, rootId: string) {
  const url = `pages/${id}/components`;
  const { request } = useRequest(url, HttpMethod.GET);
  const [loading, setLoading] = useState(false);
  const initializePage = useInitializeInputs();
  const { renderPreview } = useRenderPreview(rootId, 'preview-root');

  useEffect(() => {
    request<BlockState[]>()
      .then((response) => {
        if (!response.data) {
          return;
        }

        initializePage(response.data);
        return renderPreview(response.data || []);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [rootId]);

  return { loading };
}

function useSavePage(pageId: string, rootId: string) {
  const getInputs = useGetAllInputs(rootId);
  const { loading, request } = useRequest(`pages/${pageId}/components`, HttpMethod.POST);

  async function savePage() {
    const inputs = await getInputs();
    await request({ data: inputs });
  }

  return { loading, savePage };
}

function usePublishPage(pageId: string) {
  const { loading, request } = useRequest(`pages/${pageId}/publish`, HttpMethod.POST);

  async function publishPage() {
    await request();
  }

  return { loading, publishPage };
}

async function renderPage(rootId: string, previewElementId: string, inputs: BlockState[], prevRoot?: Root) {
  const previewElement = document.getElementById(previewElementId) as HTMLElement;

  if (!previewElement) {
    return;
  }

  let root: Root = prevRoot || ReactDOM.createRoot(previewElement);

  root.render(
    <StrictMode key={Date.now()}>
      <RecoilRoot>
        <RecoilExporter />
        <RenderApp rootId={rootId} inputs={inputs} />
      </RecoilRoot>
    </StrictMode>
  );

  return root;
}

export function useRenderPreview(rootId: string, previewElementId: string) {
  const getInputs = useGetAllInputs(rootId);
  const rootRef = useRef<Root | undefined>();

  async function renderPreview(initialInputs?: BlockState[]) {
    const inputs = initialInputs ? initialInputs : await getInputs();
    rootRef.current = await renderPage(rootId, previewElementId, inputs, rootRef.current);
  }

  return { renderPreview };
}

function usePublicPage(id: string): { loading: boolean; page?: Page } {
  const { request: fetchPage, loading } = useRequest(`pages/${id}/public`, HttpMethod.GET);
  const { request: fetchComponents, loading: loadingComponents } = useRequest(
    `pages/${id}/public/components`,
    HttpMethod.GET
  );
  const rootRef = useRef<Root | undefined>();

  useEffect(() => {
    // IIIFE to use async/await
    (async () => {
      const [pageResponse, componentsResponse] = await Promise.all([
        fetchPage<Page>(),
        fetchComponents<BlockState[]>(),
      ]);
      if (!pageResponse.data || !componentsResponse.data) {
        console.error(`Failed to fetch page ${id}`);
        return;
      }

      const rootId = pageResponse.data.rootId;
      const inputs = componentsResponse.data;
      rootRef.current = await renderPage(rootId, 'preview-root', inputs, rootRef.current);
    })();
  }, []);

  return { loading: loading || loadingComponents };
}

export { usePages, useCreatePage, usePage, useDeletePage, useFetchPage, useSavePage, usePublishPage, usePublicPage };
