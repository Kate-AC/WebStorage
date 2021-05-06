import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import Router, { useRouter } from 'next/router';

/* Common CSS */

import 'uikit/dist/css/uikit.css';
import 'uikit/dist/css/uikit.min.css';

import { FilesContextProvider } from 'contexts/FilesContext';
import { ContextMenuContextProvider } from 'contexts/ContextMenuContext';
import { executeAuthorization } from 'utils/ApiClient';

export default function App ({ Component, pageProps }: AppProps): React.ReactElement {
  const router = useRouter();

  useEffect(() => {
    const redirect = async (): Promise<void> => {
      if (router.pathname === '/login') {
        return;
      }

      const ok = await executeAuthorization();
      if (!ok) {
        Router.push('/login');
      }
    };

    redirect();
  }, [router.pathname]);

  return (
    <FilesContextProvider>
      <ContextMenuContextProvider>
        <Component {...pageProps} />
      </ContextMenuContextProvider>
    </FilesContextProvider>
  );
}
