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

const ResendEmail: NextPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [isOTPSent, setIsOTPSent] = useState(false);

    const resendEmail = async () => {
        try {
            const response = await Auth.resendSignUp(email);

            if (response) {
                alert('Code sent to your email successfully.');
                setIsOTPSent(true);
            }
        } catch (error: any) {
            alert(`Error sending email: ${error?.message}`);
        }
    };

    const confirmSignUp = async () => {
        try {
            await Auth.confirmSignUp(email, code);
            alert('Code verified successfully');
            router.push('/login');
        } catch (error: any) {
            alert(`error confirming sign up: ${error?.message}`);
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        resendEmail();
    };

    const handleResend = () => {
        resendEmail();
    };

    const handleConfirmEmail = () => {
        confirmSignUp();
    };

    return (
        <div className="md:container p-4 mx-auto flex justify-center items-center h-screen">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center justify-center w-fit bg-indigo-200 rounded-md p-6"
                autoComplete="off"
            >
                <h1 className="text-xl mb-4">Resend Sign Up Email</h1>

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
                                className="mx-2 mt-4 bg-indigo-800 text-white"
                                type="button"
                            >
                                Resend
                            </button>

                            <button
                                onClick={handleConfirmEmail}
                                className="mt-4 bg-indigo-800 text-white"
                                type="button"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                )}

                <div className={`flex flex-col items-center text-center mt-4`}>
                    <div className={`flex flex-col items-center text-center`}>
                        <Link href="/login">Login</Link>
                    </div>

                    <div className={`flex flex-col items-center text-center`}>
                        <Link href="/sign-up">Sign Up</Link>
                    </div>

                    <button
                        disabled={isOTPSent}
                        className={`mt-4 text-white ${
                            isOTPSent ? 'bg-gray-300' : 'bg-indigo-800'
                        }`}
                        type="submit"
                    >
                        Resend
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ResendEmail;
