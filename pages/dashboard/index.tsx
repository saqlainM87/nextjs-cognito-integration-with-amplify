import { NextPage, GetServerSideProps } from 'next';
import { Auth, withSSRContext } from 'aws-amplify';
import { useRouter } from 'next/router';
import Link from 'next/link';

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

export const getServerSideProps: GetServerSideProps<DashboardProp> = async (
    context
) => {
    const { res } = context;

    try {
        const { Auth } = withSSRContext(context);

        const userInfo = await Auth.currentAuthenticatedUser();

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
        //
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
            await Auth.signOut();

            router.replace('/login');
        } catch (error) {
            alert('error signing out: ' + error);
        }
    };

    const handleLogout = () => {
        signOut();
    };

    return (
        <div className="container py-4 mx-auto">
            <h1 className="text-xl mb-4">Dashboard</h1>

            <div className="float-right">
                <button className="bg-indigo-800 text-white">
                    <Link href="/mfa-setting">MFA Setting</Link>
                </button>
            </div>

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

            <button className="bg-indigo-800 text-white" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
};

export default Dashboard;
