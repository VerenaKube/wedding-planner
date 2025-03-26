import {useNavigate} from "react-router-dom";
import logo from "../assets/images/logo.png";

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
                    Herzlich willkommen und vielen Dank für eure Registrierung!
                </h1>

                <img
                    src={logo}
                    alt={"Sitzplangenerator"}
                    className="mx-auto h-30 w-auto invert brightness-100 "
                />
                <p className="text-center text-2xl font-bold tracking-tight text-white pt-15"
                   style={{fontFamily: 'Bad Script, sans-serif'}}>
                    Wir freuen uns, euch auf unserer Seite begrüßen zu dürfen. <br/> Diese Plattform wurde speziell
                    entwickelt,
                    um euch bei der Planung eurer Hochzeit zu helfen und euch die Erstellung eines Sitzplans zu
                    erleichtern. <br/>Hier könnt ihr ganz unkompliziert einen individuellen Sitzplan für eure Feier
                    erstellen.
                </p>
                <p className="text-center text-2xl font-bold tracking-tight text-white pt-10"
                   style={{fontFamily: 'Bad Script, sans-serif'}}>
                    Mit unserem Tool habt ihr die Möglichkeit, eine neue Sitzordnung zu generieren, indem ihr ganz
                    einfach eure Gästeliste eintragt. <br/> Ob Paare, Familien oder Einzelpersonen – ihr können alle
                    Gäste
                    bequem und flexibel eintragen. <br/>Ihr könnt Tische definieren, deren Anzahl und Größe festlegen
                    und
                    auch die Art der Sitzordnung bestimmen – sei es eine lange Tafel oder eine freistehende Anordnung.
                </p>
                <p className="text-center text-2xl font-bold tracking-tight text-white pt-10"
                   style={{fontFamily: 'Bad Script, sans-serif'}}>
                    Darüber hinaus könnt ihr eure Trauzeugen und deren Partner benennen und sogar Sonderregeln angeben,
                    wie
                    z.B. Gäste, die zusammen sitzen müssen oder solche, die lieber getrennt werden sollten.<br/> Am Ende
                    erhaltet ihr eine anschauliche, grafische Darstellung eurer Sitzordnung, die ihr für eure Hochzeit
                    perfekt anpassen könnt.
                </p>
                <p className="text-center text-2xl font-bold tracking-tight text-white pt-10"
                   style={{fontFamily: 'Bad Script, sans-serif'}}>
                    Wir hoffen, dass unsere Plattform euch hilft, eure Hochzeit so entspannt und stressfrei wie möglich
                    zu planen!
                </p>
            </div>
            <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="space-y-4">
                    <div className="mt-12">
                        <button
                            onClick={switchToHome}
                            type="submit"
                            className=" !text-xl hover:!border-black block w-full rounded-md bg-white px-3 py-1.5 text-base text-red-900 outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-3 focus:outline-white-600 sm:text-sm">
                            Lasst uns loslegen!
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
