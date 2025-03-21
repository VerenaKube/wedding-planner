import logo from "./assets/images/logo.png";
import {useNavigate} from "react-router-dom";
import {useState} from "react";

export default function ResetPassword() {
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const switchToHome = () => {
        navigate('/login');
    };

    const handleSubmit = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="h-screen w-full bg-[rgb(97,30,38)] flex flex-col justify-center"
             style={{width: '100vw', height: '100vh'}}>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    src={logo}
                    alt={"Sitzplangenerator"}
                    className="mx-auto h-40 w-auto invert brightness-100"
                />
                <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-white pt-10">
                    Passwort vergessen?
                </h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="space-y-4 pt-10">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-white">
                            Bitte geben Sie hier Ihre Email Addresse ein.
                        </label>
                        <div className="mt-2 pt-3">
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

                    <div className="mt-12 flex space-x-4">

                        <button
                            onClick={switchToHome}
                            type="button"
                            className="hover:!border-black flex-1 rounded-md bg-white px-3 py-1.5 text-base text-red-900 outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-3 focus:outline-white-600 sm:text-sm">
                            Zurück zum Login
                        </button>
                        <button
                            onClick={handleSubmit}
                            type="button"
                            className="hover:!border-black flex-1 rounded-md bg-white px-3 py-1.5 text-base text-red-900 outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-3 focus:outline-white-600 sm:text-sm">
                            Abschicken
                        </button>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-[rgb(97,30,38)] bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <h3 className="text-center text-xl font-semibold text-gray-800">
                            Bitte überprüfen Sie Ihr Postfach!
                        </h3>
                        <p className="text-center text-gray-600 mt-4">
                            Sie sollten eine E-Mail mit weiteren Anweisungen erhalten haben. Wenn Sie keine E-Mail
                            erhalten haben, überprüfen Sie bitte Ihren Spam-Ordner.
                        </p>
                        <div className="mt-6 text-center">
                            <button
                                onClick={() => {
                                    closeModal();
                                    switchToHome();
                                }}
                                className="hover:!border-white px-4 py-2 !bg-[rgb(97,30,38)] text-white rounded-md hover:bg-[rgb(120,40,50)]">
                                Zurück zum Login
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
