import { GetServerSideProps, NextPage } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Auth } from 'aws-amplify';
import Link from 'next/link';

import styles from './SignUp.module.css';

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    try {
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
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isOTPSent, setIsOTPSent] = useState(false);
    const [code, setCode] = useState('');

    const signUp = async () => {
        try {
            const { user } = await Auth.signUp({
                username: email,
                password,
                attributes: {
                    preferred_username: username,
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
            await Auth.confirmSignUp(email, code);
            alert('Code verified successfully');
            router.push('/login');
        } catch (error) {
            alert('error confirming sign up' + error);
        }
    };

    const resendConfirmationCode = async () => {
        try {
            await Auth.resendSignUp(email);
            alert('code resent successfully');
        } catch (error) {
            alert('error resending code: ' + error);
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
        <div className="md:container p-4 mx-auto flex justify-center items-center h-screen">
            <form
                onSubmit={handleSubmit}
                className={`${styles.signUpForm} w-fit bg-indigo-300 rounded-md p-6`}
            >
                <h1 className="text-xl mb-4">Sign Up</h1>

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
                    <label>Username:</label>
                    <input
                        name="username"
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
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
                            type="number"
                            value={code}
                            onChange={(event) => setCode(event.target.value)}
                        />
                        <button
                            className={`${styles.codeSubmitButton} bg-indigo-800 text-white`}
                            type="button"
                            onClick={handleVerification}
                        >
                            Submit
                        </button>
                        <button
                            className="bg-indigo-800 text-white"
                            onClick={handleResend}
                            type="button"
                        >
                            Resend
                        </button>
                    </div>
                )}

                <div className={styles.inputGroup}>
                    <div className={`${styles.signInLink} text-center`}>
                        <Link href="/login">Log In</Link>
                    </div>

                    <div className={`${styles.signInLink} text-center`}>
                        <Link href="/resend-email">Resend Sign Up Email</Link>
                    </div>

                    <div className="flex justify-center">
                        <button
                            disabled={isOTPSent}
                            className={`mt-4 text-white ${
                                isOTPSent ? 'bg-gray-300' : 'bg-indigo-800'
                            }`}
                            type="submit"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Login;
