import Header from '@/bigcomponents/Header';
import '@/styles/globals.css';
require('dotenv').config();


export default function App({ Component, pageProps }) {
  return (
      <>
        <Header />
        <Component {...pageProps} />
      </>
  );
}