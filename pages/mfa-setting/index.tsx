import { GetServerSideProps, NextPage } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Auth, withSSRContext } from 'aws-amplify';
import Link from 'next/link';
import QRCode from 'qrcode.react';

interface MFASettingProps {
    mfaType?: string;
    hasIdentities?: boolean;
}

export const getServerSideProps: GetServerSideProps<MFASettingProps> = async (
    context
) => {
    const { res } = context;

    try {
        const { Auth } = withSSRContext(context);

        const user = await Auth.currentAuthenticatedUser({ bypassCache: true });

        const preferredMFA = await Auth.getPreferredMFA(user);

        return {
            props: {
                mfaType: preferredMFA,
                hasIdentities: Boolean(user?.attributes?.identities),
            },
        };
    } catch (error) {
        res.setHeader('location', '/login');
        res.statusCode = 302;
        res.end();
    }

    return {
        props: {},
    };
};

const MFASetting: NextPage<MFASettingProps> = ({ mfaType, hasIdentities }) => {
    const router = useRouter();
    const [token, setToken] = useState('');
    const [qrCodeValue, setQrCodeValue] = useState('');
    const [user, setUser] = useState();

    const setupTOTP = async () => {
        try {
            const user = await Auth.currentAuthenticatedUser({
                bypassCache: true,
            });

            setUser(user);

            const code = await Auth.setupTOTP(user);

            if (code) {
                setQrCodeValue(
                    `otpauth://totp/AWSCognito:${user?.username}?secret=${code}&issuer=Cognito`
                );
            }
        } catch (error) {
            alert(`Error requesting MFA setup: ${error}`);
        }
    };

    const verifyToken = async () => {
        try {
            const tokenVerified = await Auth.verifyTotpToken(user, token);

            if (tokenVerified) {
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

    const disableMFA = async () => {
        try {
            const user = await Auth.currentAuthenticatedUser({
                bypassCache: true,
            });

            const response = await Auth.setPreferredMFA(user, 'NOMFA');

            if (response) {
                alert('MFA disabled successfully.');
                router.push('/dashboard');
            }
        } catch (error) {
            alert(`Error disabling MFA: ${error}`);
        }
    };

    const handleSetMFA = () => {
        if (mfaType !== 'NOMFA') {
            disableMFA();
        } else {
            setupTOTP();
        }
    };

    const handleVerifyToken = () => {
        verifyToken();
    };

    return (
        <div className="md:container p-4 mx-auto">
            <h1 className="text-xl mb-4">MFA Setting</h1>

            <Link replace={true} href="/dashboard">
                &#8592; Back to Dashboard
            </Link>

            <div className={`flex flex-col items-center text-center mt-4`}>
                <button
                    disabled={Boolean(qrCodeValue) || hasIdentities}
                    className={`my-4 text-white ${
                        Boolean(qrCodeValue) || hasIdentities
                            ? 'bg-gray-300'
                            : 'bg-indigo-800'
                    }`}
                    type="submit"
                    onClick={handleSetMFA}
                >
                    {mfaType !== 'NOMFA' ? 'Disable' : 'Enable'} MFA
                </button>

                {qrCodeValue && (
                    <div className="flex flex-col items-center">
                        <h3 className="text-base font-bold mb-4">
                            Scan the QR Code with your authenticator app and
                            enter the generated token
                        </h3>

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
                                className="bg-indigo-100"
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
