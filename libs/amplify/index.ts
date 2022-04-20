import { Auth, Amplify } from 'aws-amplify';

Amplify.configure({
    Auth: {
        // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
        // identityPoolId: 'XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab',

        // REQUIRED - Amazon Cognito Region
        region: process.env.NEXT_PUBLIC_COGNITO_REGION,

        // OPTIONAL - Amazon Cognito Federated Identity Pool Region
        // Required only if it's different from Amazon Cognito Region
        // identityPoolRegion: 'XX-XXXX-X',

        // OPTIONAL - Amazon Cognito User Pool ID
        userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,

        // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
        userPoolWebClientId:
            process.env.NEXT_PUBLIC_COGNITO_USER_POOL_WEB_CLIENT_ID,

        // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
        // mandatorySignIn: false,

        // OPTIONAL - Configuration for cookie storage
        // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
        // cookieStorage: {
        //     // REQUIRED - Cookie domain (only required if cookieStorage is provided)
        //     domain: 'https://saqlain-rnd.auth.ap-south-1.amazoncognito.com',
        //     // OPTIONAL - Cookie path
        //     path: '/',
        //     // OPTIONAL - Cookie expiration in days
        //     expires: 365,
        //     // OPTIONAL - See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
        //     // sameSite: 'strict' | 'lax',
        //     // OPTIONAL - Cookie secure flag
        //     // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
        //     secure: true,
        // },

        // OPTIONAL - customized storage object
        // storage: MyStorage,

        // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
        authenticationFlowType: 'USER_SRP_AUTH',

        // OPTIONAL - Manually set key value pairs that can be passed to Cognito Lambda Triggers
        // clientMetadata: { myCustomKey: 'myCustomValue' },

        // OPTIONAL - Hosted UI configuration
        oauth: {
            domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN,
            scope: [
                'email',
                'profile',
                'openid',
                'aws.cognito.signin.user.admin',
            ],
            redirectSignIn: process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_IN,
            redirectSignOut: process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_OUT,
            responseType: 'code', // or 'token', note that REFRESH token will only be generated when the responseType is code
        },
    },
});

// You can get the current config object
export const amplifyConfig = Auth.configure();

// Amplify.Logger.LOG_LEVEL = 'DEBUG';
