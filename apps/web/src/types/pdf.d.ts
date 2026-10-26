declare module '@react-pdf/renderer' {
  import { ReactElement, ReactNode, ComponentType } from 'react';

  export interface Styles {
    [key: string]: Record<string, string | number | undefined>;
  }

  export interface DocumentProps {
    children?: ReactNode;
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string;
    creator?: string;
    producer?: string;
    data?: unknown;
  }

  export interface PageProps {
    children?: ReactNode;
    size?: string | [number, number];
    orientation?: 'portrait' | 'landscape';
    style?: Record<string, string | number | undefined> | Array<Record<string, string | number | undefined>>;
  }

  export interface ViewProps {
    children?: ReactNode;
    style?: Record<string, string | number | undefined> | Array<Record<string, string | number | undefined>>;
  }

  export interface TextProps {
    children?: ReactNode;
    style?: Record<string, string | number | undefined> | Array<Record<string, string | number | undefined>>;
  }

  export const Document: ComponentType<DocumentProps>;
  export const Page: ComponentType<PageProps>;
  export const View: ComponentType<ViewProps>;
  export const Text: ComponentType<TextProps>;

  export namespace StyleSheet {
    export function create<T extends Styles>(styles: T): T;
  }

  export function renderToBuffer(element: ReactElement): Promise<Buffer>;
}
