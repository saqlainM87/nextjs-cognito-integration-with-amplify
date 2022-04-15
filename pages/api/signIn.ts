import type { NextApiRequest, NextApiResponse } from 'next';
import { Auth } from 'aws-amplify';

const signIn = async (username: string, password: string) => {
    const user = await Auth.signIn(username, password);

    return user;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { username, password } = req.body;

    res.json(await signIn(username, password));
}
