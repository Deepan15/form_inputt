import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        {/* Add a script to remove Grammarly attributes before React hydration */}
        <Script id="remove-grammarly-attrs" strategy="beforeInteractive">
          {`
            (function() {
              // Remove Grammarly extension attributes that cause hydration errors
              if (document.body) {
                document.body.removeAttribute('data-new-gr-c-s-check-loaded');
                document.body.removeAttribute('data-gr-ext-installed');
              }
            })();
          `}
        </Script>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} 