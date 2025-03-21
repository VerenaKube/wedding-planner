import logo from "./assets/images/logo.png";

export default function NavBar() {
    return (
        <nav className="fixed top-0 w-full bg-[rgb(97,30,38)] text-white">
            <div className="flex items-center p-4">
                <div>
                    <img
                        src={logo}
                        alt="Logo"
                        className="h-20 w-auto filter invert brightness-100"
                    />
                </div>

                {/* Container für Buttons */}
                <div className="flex justify-center w-full">
                    <div className="flex space-x-20 ">
                        <button
                            type="submit"
                            className="!bg-transparent !border-none !text-white hover:!text-[rgb(235,215,180)] !text-3xl focus:!outline-none p-0 ">
                            Home
                        </button>


                        <button
                            type="submit"
                            className="!bg-transparent !border-none !text-white hover:!text-[rgb(235,215,180)] !text-3xl focus:!outline-none p-0 ">
                            Hilfe
                        </button>
                        <button
                            type="submit"
                            className="!bg-transparent !border-none !text-white hover:!text-[rgb(235,215,180)] !text-3xl focus:!outline-none p-0 ">
                            Kontakt
                        </button>
                    </div>
                </div>


            </div>
        </nav>
    );
}
