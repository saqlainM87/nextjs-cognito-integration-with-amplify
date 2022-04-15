import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Amplify } from 'aws-amplify';

import { amplifyConfig } from '../libs/amplify';

Amplify.configure(amplifyConfig);

function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}

export default MyApp;
