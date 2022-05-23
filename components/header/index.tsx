import { Auth } from 'aws-amplify';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

export const Header = (): JSX.Element => {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuClick = () => {
        setTimeout(() => {
            setIsMenuOpen((state) => !state);
        }, 100);
    };

    const signOut = async () => {
        try {
            await Auth.signOut();

            router.replace('/login');
        } catch (error: any) {
            alert(`error signing out: ${error?.message}`);
        }
    };

    const handleSignOut = () => {
        signOut();
    };

    return (
        <nav className="bg-indigo-800">
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                <div className="relative flex items-center justify-between h-16">
                    <div className="flex-1 flex items-center justify-between sm:items-stretch sm:justify-start">
                        <div className="flex-shrink-0 flex items-center">
                            <Image
                                width="40px"
                                height="40px"
                                className="block h-8 w-auto"
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQNWteNDbJjmoWTruYgIjEHTMwW2qCOCCgnyvIQHBruID23As6BNhYrJQHX5q_rxp9QDU&usqp=CAU"
                                alt="Workflow"
                            />
                            <span className="text-white text-xl px-4">
                                Amazon Cognito Demo
                            </span>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        {/* Profile dropdown */}

                        <div className="ml-3 relative">
                            <div>
                                <button
                                    type="button"
                                    className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                                    id="user-menu-button"
                                    aria-expanded="false"
                                    aria-haspopup="true"
                                    onClick={handleMenuClick}
                                    // onFocus={handleMenuClick}
                                    onBlur={() => {
                                        setTimeout(() => {
                                            setIsMenuOpen(false);
                                        }, 100);
                                    }}
                                >
                                    <span className="sr-only">
                                        Open user menu
                                    </span>
                                    <Image
                                        width="32px"
                                        height="32px"
                                        className="block rounded-full"
                                        src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
                                        alt="Workflow"
                                    />
                                </button>
                            </div>

                            {isMenuOpen && (
                                <div
                                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                                    role="menu"
                                    aria-orientation="vertical"
                                    aria-labelledby="user-menu-button"
                                    tabIndex={-1}
                                >
                                    <span
                                        className="block px-4 py-2 text-sm text-gray-700"
                                        role="menuitem"
                                        tabIndex={-1}
                                        id="user-menu-item-0"
                                    >
                                        <Link href="/dashboard">Dashboard</Link>
                                    </span>
                                    <span
                                        className="block px-4 py-2 text-sm text-gray-700"
                                        role="menuitem"
                                        tabIndex={-1}
                                        id="user-menu-item-0"
                                    >
                                        <Link href="/mfa-setting">
                                            MFA Setting
                                        </Link>
                                    </span>
                                    <span
                                        className="cursor-pointer block px-4 py-2 text-sm text-gray-700"
                                        role="menuitem"
                                        tabIndex={-1}
                                        id="user-menu-item-0"
                                        onClick={handleSignOut}
                                    >
                                        Logout
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};
