import { NextPage } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Auth } from 'aws-amplify';
import Link from 'next/link';

const ForgotPassword: NextPage = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [isOTPSent, setIsOTPSent] = useState(false);

    const requestForReset = async () => {
        try {
            // Send confirmation code to user's email
            const response = await Auth.forgotPassword(username);

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
                username,
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
        <div className="md:container p-4 mx-auto">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center justify-center"
            >
                <h1 className="text-xl mb-4">Forgot Password?</h1>

                <div className="my-4">
                    <label className="px-4">Username/Email:</label>
                    <input
                        name="username"
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                </div>

                {isOTPSent && (
                    <div className="my-4 flex flex-col items-center justify-center">
                        <div className="mb-2">
                            <label className="px-4">Code:</label>
                            <input
                                name="code"
                                type="text"
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
