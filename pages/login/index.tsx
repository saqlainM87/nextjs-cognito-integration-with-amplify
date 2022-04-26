import { GetServerSideProps, NextPage } from 'next';
import { getSession, signIn } from 'next-auth/react';

import styles from './Login.module.css';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { res, req } = context;

    try {
        const session: any = await getSession({ req });

        if (session) {
            res.setHeader('location', '/dashboard');
            res.statusCode = 302;
            res.end();
        }
    } catch (error) {
        //
    }

    return {
        props: {},
    };
};

const Login: NextPage = () => {
    const logIn = async () => {
        try {
            await signIn('cognito', {
                callbackUrl: '/dashboard',
            });
        } catch (error) {
            alert(error);
        }
    };

    const handleSubmit = () => {
        logIn();
    };

    return (
        <div className="md:container p-4 mx-auto flex justify-center items-center h-screen">
            <form
                className={`${styles.loginForm} w-60 bg-indigo-200 rounded-md p-6`}
            >
                <h1 className="text-xl mb-4">Log In</h1>

                <div
                    className={`${styles.inputGroup} flex flex-col items-center text-center`}
                >
                    <button
                        className={`mt-4 text-white bg-indigo-800`}
                        type="button"
                        onClick={handleSubmit}
                    >
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;
