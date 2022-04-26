import { NextPage, GetServerSideProps } from 'next';
import { useState } from 'react';
import { getSession, signOut } from 'next-auth/react';

interface DashboardProp {
    userInfo?: {
        username?: string;
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
    const { res, req } = context;

    try {
        const session: any = await getSession({ req });

        if (session) {
            return {
                props: {
                    userInfo: {
                        attributes: {
                            sub: session?.user?.sub || '',
                            name: session?.user?.name || '',
                            email: session?.user?.email || '',
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
    const [user, setUser] = useState(userInfo);

    const logOut = async () => {
        try {
            await signOut({ callbackUrl: '/api/auth/logout' });
        } catch (error) {
            alert('Error signing out: ' + error);
        }
    };

    const handleLogout = () => {
        logOut();
    };

    return (
        <div className="md:container p-4 mx-auto">
            <h1 className="text-xl mb-4">Dashboard</h1>

            <div className="float-right"></div>

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
