import { Auth } from 'aws-amplify';
import { NextApiRequest, NextApiResponse } from 'next';

// Logout handler to logout from the provider as well
const logoutHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        await Auth.signOut();
    }

    res.end();
};

export default logoutHandler;
