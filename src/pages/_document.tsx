import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <body className="font-sans text-foreground bg-backgroundStart">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
