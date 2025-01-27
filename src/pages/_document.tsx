import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <body className="text-foreground bg-backgroundStart font-sans">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
