// pages/_app.js
import '../styles/globals.css';
import { NumberProvider } from '../context/NumberContext';
import Head from 'next/head';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function MyApp({ Component, pageProps }) {
  return (
    <NumberProvider>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <DndProvider backend={HTML5Backend}>
        <Component {...pageProps} />
      </DndProvider>
    </NumberProvider>
  );
}

export default MyApp;
