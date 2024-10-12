// pages/_app.js
import '../styles/globals.css';
import { NumberProvider } from '../context/NumberContext';

function MyApp({ Component, pageProps }) {
  return (
    <NumberProvider>
      <Component {...pageProps} />
    </NumberProvider>
  );
}

export default MyApp;
