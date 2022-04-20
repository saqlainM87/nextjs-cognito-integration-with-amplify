import type { AppProps } from 'next/app';
import { Amplify } from 'aws-amplify';

import '../styles/globals.css';

import { amplifyConfig } from '../libs/amplify';

Amplify.configure({ ...amplifyConfig, ssr: true });

function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}

export default MyApp;
