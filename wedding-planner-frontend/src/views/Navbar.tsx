import logo from "../assets/images/logo.png";
import {useNavigate} from "react-router-dom";

export default function NavBar() {

    const navigate = useNavigate();
    const switchToHome = () => {
        navigate('/home');
    }
    return (
        <nav className="fixed top-0 w-full bg-[rgb(97,30,38)] text-white">
            <div className="flex items-center p-2 pr-5">
                <div>
                    <img
                        src={logo}
                        alt="Logo"
                        className="h-12 w-auto filter invert brightness-100 pl-4"
                    />
                </div>
                <div className="flex justify-end w-full">
                    <div className="flex space-x-20">
                        <button
                            onClick={switchToHome}
                            type="submit"
                            className="navbar-buttons">
                            Home
                        </button>
                        <button
                            type="submit"
                            className="navbar-buttons">
                            Hilfe
                        </button>
                        <button
                            type="submit"
                            className="navbar-buttons">
                            Kontakt
                        </button>
                    </div>
                </div>


            </div>
        </nav>
    );
}
