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
        <div className="h-screen w-full bg-[rgb(97,30,38)] flex flex-col justify-center "
             style={{width: '100vw', height: '100vh'}}>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    src={logo}
                    alt={"Sitzplangenerator"}
                    className="mx-auto h-40 w-auto invert brightness-100"
                />
                <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-white">
                    Sign in to your account
                </h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-white">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                                className="hover:border-black block w-full rounded-md bg-white px-3 py-1.5 text-base text-red-900 border-1 border-transparent outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline- focus:outline-white-600 sm:text-sm"
                            />
                        </div>

                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium text-white">
                                Password
                            </label>
                            <div className="text-sm">
                                <a href="#"
                                   onClick={switchToResetPassword}
                                   className="font-semibold text-[rgb(207,185,151)] hover:!text-[rgb(235,215,180)] focus:!text-[rgb(207,185,151)] active:!text-[rgb(207,185,151)] visited:!text-[rgb(207,185,151)]">
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
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-red-900 outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-3 focus:outline-white-600 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div className="mt-12">
                        <button
                            onClick={switchToHome}
                            type="submit"
                            className=" hover:!border-black block w-full rounded-md bg-white px-3 py-1.5 text-base text-red-900 outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-3 focus:outline-white-600 sm:text-sm">
                            Sign in
                        </button>
                    </div>
                </div>
                <p className="mt-4 text-center text-sm text-white">
                    Not a member?{' '}
                    <a href="#"
                       onClick={switchToRegistration}
                       className="font-semibold text-[rgb(207,185,151)] hover:!text-[rgb(235,215,180)] focus:!text-[rgb(207,185,151)] active:!text-[rgb(207,185,151)] visited:!text-[rgb(207,185,151)]">
                        Hier registrieren!
                    </a>
                </p>
            </div>
        </div>
    );
}
