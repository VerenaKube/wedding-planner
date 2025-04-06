import logo from "../assets/images/logo.png";
import {useNavigate} from "react-router-dom";
import {useState} from "react";

export default function ResetPassword() {
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const switchToLogin = () => {
        navigate('/login');
    };

    const handleSubmit = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="h-screen w-screen bg-[rgb(97,30,38)] flex flex-col justify-center">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    src={logo}
                    alt={"Sitzplangenerator"}
                    className="mx-auto h-40 w-auto invert brightness-100"
                />
                <h2 className="headline-red-background pt-8">
                    Passwort vergessen?
                </h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="space-y-4 pt-10">
                    <div>
                        <label htmlFor="email" className="white-font-left-aligned">
                            Bitte geben Sie hier Ihre Email Addresse ein.
                        </label>
                        <div className=" pt-2">
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
                    <div className="mt-8 flex space-x-4 gap-2">
                        <button
                            onClick={switchToLogin}
                            type="button"
                            className="white-button-on-red-background-separated">
                            Zurück zum Login
                        </button>
                        <button
                            onClick={handleSubmit}
                            type="button"
                            className="white-button-on-red-background-separated">
                            Abschicken
                        </button>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-[rgb(97,30,38)] bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <h3 className="headline-white-background">
                            Bitte überprüfen Sie Ihr Postfach!
                        </h3>
                        <p className="mt-8 red-font-center-aligned">
                            Sie sollten eine E-Mail mit weiteren Anweisungen erhalten haben. Wenn Sie keine E-Mail
                            erhalten haben, überprüfen Sie bitte Ihren Spam-Ordner.
                        </p>
                        <div className="mt-8 text-center">
                            <button
                                onClick={() => {
                                    closeModal();
                                    switchToLogin();
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
