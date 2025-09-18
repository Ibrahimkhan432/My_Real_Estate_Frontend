import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="w-full bg-blue-800 text-white text-center py-4 px-3 mt-10">
            <p className="text-xs sm:text-sm md:text-base">
                © {new Date().getFullYear()} My Real Estate | Developer:{" "}
                <a
                    href="https://github.com/Ibrahimkhan432"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-100 hover:underline"
                >
                    Ibrahim Khan
                </a>
            </p>
        </footer>

    );
}
