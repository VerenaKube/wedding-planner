import logo from "../assets/images/logo.png";
import {useNavigate} from "react-router-dom";

export default function Registration() {
    const navigate = useNavigate();

    const switchToWelcome = () => {
        navigate('/welcome');
    }

    const switchToLogin = () => {
        navigate('/login');
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
                    Account erstellen
                </h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="space-y-4">
                    <div>
                        <p className="block text-sm font-medium text-white">
                            Vor- und Nachname
                        </p>
                        <div className="mt-2">
                            <input
                                className="white-textfield-on-red-background"
                            />
                        </div>
                    </div>
                    <div>
                        <p className="block text-sm font-medium text-white">
                            Email Adresse
                        </p>
                        <div className="mt-2">
                            <input
                                className="white-textfield-on-red-background"
                            />
                        </div>
                    </div>
                    <div>
                        <p className="block text-sm font-medium text-white">
                            Passwort
                        </p>
                        <div className="mt-2">
                            <input
                                className="white-textfield-on-red-background"
                            />
                        </div>
                    </div>
                    <div>
                        <p className="block text-sm font-medium text-white">
                            Passwort wiederholen
                        </p>
                        <div className="mt-2">
                            <input
                                className="white-textfield-on-red-background"
                            />
                        </div>
                    </div>

                    <div className="mt-12 flex space-x-4">
                        <button
                            onClick={switchToLogin}
                            type="button"
                            className="white-button-on-red-background-separated">
                            Zurück zum Login
                        </button>
                        <button
                            onClick={switchToWelcome}
                            type="button"
                            className="white-button-on-red-background-separated">
                            Registrieren
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
