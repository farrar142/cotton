import { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import {
  DocumentHeadTags,
  documentGetInitialProps,
  DocumentHeadTagsProps,
} from '@mui/material-nextjs/v13-pagesRouter';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';

export default function Document(props: DocumentHeadTagsProps) {
  return (
    <Html lang='en'>
      <Head>
        <DocumentHeadTags {...props} />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <body>
        <InitColorSchemeScript attribute='class' />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

Document.getInitialProps = async (ctx: DocumentContext) => {
  const finalProps = await documentGetInitialProps(ctx);
  return finalProps;
};
