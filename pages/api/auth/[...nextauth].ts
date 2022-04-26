import NextAuth from 'next-auth';
import CognitoProvider from 'next-auth/providers/cognito';

export default NextAuth({
    providers: [
        CognitoProvider({
            clientId: process.env.COGNITO_NEXT_AUTH_CLIENT_ID || '',
            clientSecret: process.env.COGNITO_NEXT_AUTH_CLIENT_SECRET || '',
            issuer: process.env.COGNITO_NEXT_AUTH_ISSUER || '',
        }),
    ],
    callbacks: {
        session({ session, token, user }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    sub: token.sub,
                },
            };
        },
    },
    // debug: process.env.NODE_ENV === 'development' ? true : false,
});
