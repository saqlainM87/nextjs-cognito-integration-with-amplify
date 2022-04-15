import { NextPage, GetServerSideProps } from 'next';
import { Auth } from 'aws-amplify';
import { useRouter } from 'next/router';
import axios from 'axios';

interface DashboardProp {
    userInfo?: {
        username: string;
        attributes: {
            sub: string;
            name: string;
            email: string;
        };
    };
}

export const getServerSideProps: GetServerSideProps<DashboardProp> = async ({
    res,
}) => {
    try {
        const userInfo = await Auth.currentUserInfo();

        if (userInfo) {
            return {
                props: {
                    userInfo: {
                        username: userInfo.username || '',
                        attributes: {
                            sub: userInfo.attributes?.sub || '',
                            name: userInfo.attributes?.name || '',
                            email: userInfo.attributes?.email || '',
                        },
                    },
                },
            };
        }
    } catch (error) {
        res.setHeader('location', '/login');
        res.statusCode = 302;
        res.end();

        return {
            props: {},
        };
    }

    res.setHeader('location', '/login');
    res.statusCode = 302;
    res.end();

    return {
        props: {},
    };
};

const Dashboard: NextPage<DashboardProp> = ({ userInfo }) => {
    const router = useRouter();

    const signOut = async () => {
        try {
            await Auth.signOut(); // Logs out from client side
            await axios.get('/api/signOut'); //Logs out from server side

            router.replace('/login');
        } catch (error) {
            console.log('error signing out: ', error);
        }
    };

    const handleLogout = () => {
        signOut();
    };

    return (
        <div>
            <h1>Dashboard</h1>

            <span>
                Welcome, <strong>{userInfo?.attributes.name}</strong>
            </span>
            <br />
            <span>
                Your Email: <strong>{userInfo?.attributes.email}</strong>
            </span>
            <br />
            <span>
                Your Username: <strong>{userInfo?.username}</strong>
            </span>
            <br />
            <span>
                Your UID: <strong>{userInfo?.attributes?.sub}</strong>
            </span>
            <br />
            <br />

            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Dashboard;
