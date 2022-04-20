import { GetServerSideProps, NextPage } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Auth, withSSRContext } from 'aws-amplify';
import Link from 'next/link';
import QRCode from 'qrcode.react';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { res } = context;

    try {
        const { Auth } = withSSRContext(context);

        await Auth.currentAuthenticatedUser();
    } catch (error) {
        res.setHeader('location', '/login');
        res.statusCode = 302;
        res.end();
    }

    return {
        props: {},
    };
};

const MFASetting: NextPage = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [token, setToken] = useState('');
    const [isOTPSent, setIsOTPSent] = useState(false);
    const [qrCodeValue, setQrCodeValue] = useState('');
    const [user, setUser] = useState();

    const setupTOTP = async () => {
        try {
            const user = await Auth.currentAuthenticatedUser();

            setUser(user);

            // Send confirmation code to user's email
            const code = await Auth.setupTOTP(user);

            if (code) {
                setQrCodeValue(
                    `otpauth://totp/AWSCognito:${username}?secret=${code}&issuer=Cognito`
                );
            }
        } catch (error) {
            alert(`Error requesting MFA setup: ${error}`);
        }
    };

    const verifyToken = async () => {
        try {
            const verifiedUser = await Auth.verifyTotpToken(user, token);

            if (verifiedUser) {
                const response = await Auth.setPreferredMFA(user, 'TOTP');

                if (response) {
                    alert('MFA set up successful.');

                    router.push('/dashboard');
                }
            }
        } catch (error) {
            alert(`Error requesting reset password: ${error}`);
        }
    };

    const handleEnableMFA = () => {
        setupTOTP();
    };

    const handleVerifyToken = () => {
        verifyToken();
    };

    return (
        <div className="container py-4 mx-auto">
            <h1 className="text-xl mb-4">MFA Setting</h1>

            <Link replace={true} href="/dashboard">
                &#8592; Back to Dashboard
            </Link>

            <div className={`flex flex-col items-center text-center mt-4`}>
                <button
                    disabled={isOTPSent}
                    className={`my-4 text-white ${
                        isOTPSent ? 'bg-gray-300' : 'bg-indigo-800'
                    }`}
                    type="submit"
                    onClick={handleEnableMFA}
                >
                    Enable MFA
                </button>

                {qrCodeValue && (
                    <div className="flex flex-col items-center">
                        <QRCode value={qrCodeValue} />

                        <div className="my-4">
                            <label className="px-4">Enter Token:</label>
                            <input
                                name="token"
                                type="text"
                                value={token}
                                onChange={(event) =>
                                    setToken(event.target.value)
                                }
                            />
                            <button
                                className="ml-2 text-white bg-indigo-800"
                                type="button"
                                onClick={handleVerifyToken}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MFASetting;
