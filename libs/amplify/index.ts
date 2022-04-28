import { Amplify } from 'aws-amplify';

export const amplifyConfig = Amplify.configure({
    Auth: {
        region: process.env.NEXT_PUBLIC_COGNITO_REGION,
        userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
        userPoolWebClientId:
            process.env.NEXT_PUBLIC_COGNITO_USER_POOL_WEB_CLIENT_ID,
        authenticationFlowType: 'USER_SRP_AUTH',
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
            responseType: 'code',
        },
    },
});

// Amplify.Logger.LOG_LEVEL = 'DEBUG';
