import { GetServerSideProps, NextPage } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Auth, withSSRContext } from 'aws-amplify';
import Link from 'next/link';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { res } = context;

    try {
        const { Auth } = withSSRContext(context);

        const userInfo = await Auth.currentAuthenticatedUser({
            bypassCache: true,
        });

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

const ForgotPassword: NextPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [isOTPSent, setIsOTPSent] = useState(false);

    const requestForReset = async () => {
        try {
            // Send confirmation code to user's email
            const response = await Auth.forgotPassword(email);

            if (response) {
                alert('Code sent to email successfully for password reset.');
                setIsOTPSent(true);
            }
        } catch (error) {
            alert(`Error requesting reset password: ${error}`);
        }
    };

    const resetPassword = async () => {
        try {
            // Collect confirmation code and new password, then
            const response = await Auth.forgotPasswordSubmit(
                email,
                code,
                password
            );

            if (response) {
                alert('Password reset successful');
                router.push('/login');
            }
        } catch (error) {
            alert(`Error resetting password: ${error}`);
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        requestForReset();
    };

    const handleReset = () => {
        resetPassword();
    };

    const handleResend = () => {
        requestForReset();
    };

    return (
        <div className="md:container p-4 mx-auto flex justify-center items-center h-screen">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center justify-center w-fit bg-indigo-200 rounded-md p-6"
                autoComplete="off"
            >
                <h1 className="text-xl mb-4">Forgot Password?</h1>

                <div className="my-4">
                    <label className="px-4">Email:</label>
                    <input
                        name="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>

                {isOTPSent && (
                    <div className="my-4 flex flex-col items-center justify-center">
                        <div className="mb-2">
                            <label className="px-4">Code:</label>
                            <input
                                name="code"
                                type="number"
                                value={code}
                                onChange={(event) =>
                                    setCode(event.target.value)
                                }
                            />
                            <button
                                onClick={handleResend}
                                className="ml-2 mt-4 bg-indigo-800 text-white"
                                type="button"
                            >
                                Resend
                            </button>
                        </div>

                        <div>
                            <label className="px-4">New Password:</label>
                            <input
                                name="password"
                                type="password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                            />
                        </div>

                        <button
                            onClick={handleReset}
                            className="mt-4 bg-indigo-800 text-white"
                            type="button"
                        >
                            Submit
                        </button>
                    </div>
                )}

                <div className={`flex flex-col items-center text-center mt-4`}>
                    <div className={`flex flex-col items-center text-center`}>
                        <Link href="/login">Login</Link>
                    </div>

                    <button
                        disabled={isOTPSent}
                        className={`mt-4 text-white ${
                            isOTPSent ? 'bg-gray-300' : 'bg-indigo-800'
                        }`}
                        type="submit"
                    >
                        Request for Reset
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ForgotPassword;
