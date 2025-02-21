import Header from '@/bigcomponents/Header';
import '@/styles/globals.css';
import { SpotifyProvider } from '../context/SpotifyContext'; // Adjust the path based on where SpotifyContext is located

export default function App({ Component, pageProps }) {
  return (
    <SpotifyProvider>
      <>
        <Header />
        <Component {...pageProps} />
      </>
    </SpotifyProvider>
  );
}