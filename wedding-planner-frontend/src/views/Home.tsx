import NavBar from "./Navbar.tsx";
import Footer from "./Footer.tsx";
import {useNavigate} from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
    const switchToOverview = () => {
        navigate('/overview');
    }

    return (
        <div>
            <NavBar/>

            <div className="w-screen h-screen flex justify-center items-start">

                <button
                    className="red-button w-1/6 mt-30"
                    onClick={switchToOverview}>
                    <span className="flex items-center justify-center gap-3">

                        <p className="text-3xl leading-none">+ </p>
                        <p className="text-lg">Neuer Sitzplan</p>
                    </span>
                </button>
            </div>
            <Footer/>
        </div>
    );
}
