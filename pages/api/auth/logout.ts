import { NextApiRequest, NextApiResponse } from 'next';

// Logout handler to logout from the provider as well
const logoutHandler = (req: NextApiRequest, res: NextApiResponse) => {
    res.redirect(
        `https://${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}/logout?client_id=${process.env.COGNITO_NEXT_AUTH_CLIENT_ID}&logout_uri=${process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_OUT}`
    );
};

export default logoutHandler;
