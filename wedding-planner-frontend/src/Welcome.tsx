import {useNavigate} from "react-router-dom";
import logo from "./assets/images/logo.png";

export default function Welcome() {
    const navigate = useNavigate();

    const switchToHome = () => {
        navigate('/home');
    }

    return (
        <div className="min-h-screen w-screen bg-[rgb(97,30,38)] flex flex-col ">
            <div className="sm:mx-auto">
                <h1 className="mt-10 text-center text-2xl font-bold tracking-tight text-white p-15"
                    style={{fontFamily: 'Bad Script, sans-serif'}}>
                    Willkommen beim Sitzplangenerator!
                </h1>

                <img
                    src={logo}
                    className="mx-auto h-30 w-auto invert brightness-100"
                />
                <p className="text-center text-2xl font-bold tracking-tight text-white pt-10"
                   style={{fontFamily: 'Bad Script, sans-serif'}}>
                    Das hier ist mein Text.
                </p>
                <p className="text-center text-2xl font-bold tracking-tight text-white pt-10"
                   style={{fontFamily: 'Bad Script, sans-serif'}}>
                    Das ist ein Beispiel.
                </p>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="space-y-4">
                    <div className="mt-12">
                        <button
                            onClick={switchToHome}
                            type="submit"
                            className=" hover:!border-black block w-full rounded-md bg-white px-3 py-1.5 text-base text-red-900 outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-3 focus:outline-white-600 sm:text-sm">
                            Verstanden!
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
