import logo from "../assets/images/logo.png";
import {useNavigate} from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    const switchToHome = () => {
        navigate('/home');
    }
    const switchToRegistration = () => {
        navigate('/registration');
    }
    const switchToResetPassword = () => {
        navigate('/password-reset');
    }

    return (
        <div className="h-screen w-screen bg-[rgb(97,30,38)] flex flex-col justify-center ">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    src={logo}
                    alt={"Sitzplangenerator"}
                    className="mx-auto h-40 w-auto invert brightness-100"
                />
                <p className="headline-red-background">
                    Sign in to your account
                </p>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="email" className="white-font-left-aligned">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                                className="white-textfield-on-red-background"
                            />
                        </div>

                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="white-font-left-aligned">
                                Password
                            </label>
                            <div className="text-sm">
                                <a href="#"
                                   onClick={switchToResetPassword}
                                   className="login-links">
                                    Forgot password?
                                </a>


                            </div>
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                autoComplete="current-password"
                                className="white-textfield-on-red-background"
                            />
                        </div>
                    </div>

                    <div className="mt-12">
                        <button
                            onClick={switchToHome}
                            type="submit"
                            className="white-button-on-red-background">
                            Sign in
                        </button>
                    </div>
                </div>
                <p className="mt-4 white-font-center-aligned">
                    Not a member?{' '}
                    <a href="#"
                       onClick={switchToRegistration}
                       className="login-links">
                        Hier registrieren!
                    </a>
                </p>
            </div>
        </div>
    );
}
