import { useEffect } from 'react';

export const usePageTitle = (title: string) => {
  useEffect(() => {
    document.title = `${title} | ::-1`;
  }, [title]);
};
