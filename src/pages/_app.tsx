import { useEffect } from 'react';
import type { AppProps } from 'next/app';

// This is a workaround for hydration mismatches caused by browser extensions
// like Grammarly that modify the DOM before React can hydrate it
export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // This runs after hydration and can help clean up any attributes
    // added by browser extensions
    const body = document.querySelector('body');
    if (body) {
      body.removeAttribute('data-new-gr-c-s-check-loaded');
      body.removeAttribute('data-gr-ext-installed');
    }
  }, []);

  return <Component {...pageProps} />;
} 