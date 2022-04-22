import { NextPage, GetServerSideProps } from 'next';
import { Auth, withSSRContext } from 'aws-amplify';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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
                        username: userInfo.attributes?.preferred_username || '',
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

    return {
        props: {},
    };
};

const Dashboard: NextPage<DashboardProp> = ({ userInfo }) => {
    const router = useRouter();
    const [user, setUser] = useState(userInfo);

    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                const user = await Auth.currentAuthenticatedUser();

                if (user) {
                    setUser(user);
                }
            } catch (error) {
                router.replace('/login');
            }
        };

        if (!userInfo) {
            getAndSetUser();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        <div className="md:container p-4 mx-auto">
            <h1 className="text-xl mb-4">Dashboard</h1>

            <div className="float-right">
                <button className="bg-indigo-800 text-white">
                    <Link href="/mfa-setting">MFA Setting</Link>
                </button>
            </div>

            <span>
                Welcome, <strong>{user?.attributes.name}</strong>
            </span>
            <br />
            <span>
                Your Email: <strong>{user?.attributes.email}</strong>
            </span>
            <br />
            <span>
                Your Username: <strong>{user?.username}</strong>
            </span>
            <br />
            <span>
                Your UID: <strong>{user?.attributes?.sub}</strong>
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
