import { GetServerSideProps, NextPage } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Auth } from 'aws-amplify';

import styles from './SignUp.module.css';
import Link from 'next/link';

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
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isOTPSent, setIsOTPSent] = useState(false);
    const [code, setCode] = useState('');
    const router = useRouter();

    const signUp = async () => {
        try {
            const { user } = await Auth.signUp({
                username,
                password,
                attributes: {
                    email,
                    name,
                },
            });

            if (user) {
                alert('Verification code has been sent to your mail.');
                setIsOTPSent(true);
            }
        } catch (error) {
            alert(`Error signing up: ${error}`);
        }
    };

    const confirmSignUp = async () => {
        try {
            await Auth.confirmSignUp(username, code);
            alert('code verified successfully');
            router.push('/login');
        } catch (error) {
            console.log('error confirming sign up', error);
        }
    };

    const resendConfirmationCode = async () => {
        try {
            await Auth.resendSignUp(username);
            alert('code resent successfully');
        } catch (err) {
            console.log('error resending code: ', err);
        }
    };

    const handleVerification = () => {
        confirmSignUp();
    };

    const handleResend = () => {
        resendConfirmationCode();
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        signUp();
    };

    return (
        <div className="container py-4 mx-auto">
            <form onSubmit={handleSubmit} className={styles.signUpForm}>
                <h1 className="text-xl">Sign Up</h1>

                <div className={styles.inputGroup}>
                    <label>Username:</label>
                    <input
                        name="username"
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                </div>

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
                    <label>Name:</label>
                    <input
                        name="name"
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
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

                {isOTPSent && (
                    <div className={styles.inputGroup}>
                        <label>Code:</label>
                        <input
                            name="code"
                            type="code"
                            value={code}
                            onChange={(event) => setCode(event.target.value)}
                        />
                        <button
                            className={styles.codeSubmitButton}
                            type="button"
                            onClick={handleVerification}
                        >
                            Submit
                        </button>
                        <button onClick={handleResend} type="button">
                            Resend
                        </button>
                    </div>
                )}

                <div className={styles.inputGroup}>
                    <div className={`${styles.signInLink} text-center`}>
                        <Link href="/login">Log In</Link>
                    </div>

                    <button className="mt-4" type="submit">
                        Sign Up
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;
