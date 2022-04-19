import { GetServerSideProps, NextPage } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Auth } from 'aws-amplify';
import axios from 'axios';
import Link from 'next/link';

import styles from './Login.module.css';

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    try {
        const userInfo = await Auth.currentUserInfo();

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
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const signIn = async () => {
        try {
            // const user = await Auth.signIn(username, password); // Logs in at client side
            const response = await axios.post('/api/signIn', {
                username,
                password,
            }); // Logs in at server side

            if (
                response
                // && user
            ) {
                router.push('/dashboard');
            }
        } catch (error) {
            alert(`Error signing in: ${error}`);
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        signIn();
    };

    return (
        <div className="container py-4 mx-auto">
            <form onSubmit={handleSubmit} className={styles.loginForm}>
                <h1 className="text-xl">Log In</h1>

                <div className={styles.inputGroup}>
                    <label>Username/Email:</label>
                    <input
                        name="username"
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
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

                <div
                    className={`${styles.inputGroup} flex flex-col align-center text-center`}
                >
                    <div
                        className={`${styles.link} flex flex-col align-center text-center`}
                    >
                        <Link href="/sign-up">Sign Up</Link>
                    </div>

                    <div
                        className={`${styles.link} flex flex-col align-center text-center`}
                    >
                        <Link href="/forgot-password">Forgot Password?</Link>
                    </div>

                    <button className="mt-4" type="submit">
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;
