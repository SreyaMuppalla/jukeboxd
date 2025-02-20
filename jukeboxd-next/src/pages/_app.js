import Header from '@/bigcomponents/Header';
import '@/styles/globals.css';
import { RecoilRoot } from 'recoil';

export default function App({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <Header />
      <Component {...pageProps} />
    </RecoilRoot>
  );
}
