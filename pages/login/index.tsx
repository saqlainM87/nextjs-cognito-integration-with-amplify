import { GetServerSideProps, NextPage } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Auth, withSSRContext } from 'aws-amplify';
import Link from 'next/link';

import styles from './Login.module.css';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { res } = context;

    try {
        const { Auth } = withSSRContext(context);

        const userInfo = await Auth.currentAuthenticatedUser();

        if (userInfo) {
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
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [needMFA, setNeedMFA] = useState(false);
    const [user, setUser] = useState();
    const router = useRouter();

    const signIn = async () => {
        try {
            const user = await Auth.signIn(email, password);
            setUser(user);

            console.log(user);

            if (user.challengeName === 'SOFTWARE_TOKEN_MFA') {
                return setNeedMFA(true);
            }

            if (user) {
                router.push('/dashboard');
            }
        } catch (error) {
            alert(`Error signing in: ${error}`);
        }
    };

    const confirmSignIn = async () => {
        try {
            const loggedUser = await Auth.confirmSignIn(
                user,
                code,
                'SOFTWARE_TOKEN_MFA'
            ); // Confirm login with code

            if (loggedUser) {
                router.replace('/dashboard');
            }
        } catch (error) {
            alert(`Error signing in: ${error}`);
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        signIn();
    };

    const handleVerifyCode = () => {
        confirmSignIn();
    };

    return (
        <div className="md:container p-4 mx-auto">
            <form onSubmit={handleSubmit} className={styles.loginForm}>
                <h1 className="text-xl mb-4">Log In</h1>

                <div className={styles.inputGroup}>
                    <label>Email:</label>
                    <input
                        name="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>Password:</label>
                    <input
                        name="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>

                {needMFA && (
                    <div className={styles.inputGroup}>
                        <label>Code:</label>
                        <input
                            name="code"
                            type="number"
                            value={code}
                            onChange={(event) => setCode(event.target.value)}
                        />

                        <button
                            className="ml-2 text-white bg-indigo-800"
                            type="button"
                            onClick={handleVerifyCode}
                        >
                            Submit
                        </button>
                    </div>
                )}

                <div
                    className={`${styles.inputGroup} flex flex-col items-center text-center`}
                >
                    <div
                        className={`${styles.link} flex flex-col items-center text-center`}
                    >
                        <Link href="/sign-up">Sign Up</Link>
                    </div>

                    <div
                        className={`${styles.link} flex flex-col items-center text-center`}
                    >
                        <Link href="/forgot-password">Forgot Password?</Link>
                    </div>

                    <button
                        disabled={needMFA}
                        className={`mt-4 text-white ${
                            needMFA ? 'bg-gray-300' : 'bg-indigo-800'
                        }`}
                        type="submit"
                    >
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;
