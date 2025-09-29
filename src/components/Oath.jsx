import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { app } from "../../firebase";
import { signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../constant/constant.js";
const Oath = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      console.log("Google Sign-In Result:", result);

      const res = await fetch(`${BASE_URL}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: {
            userName: result.user.displayName,
            email: result.user.email,
            img: result.user.photoURL,
          }
        }),
      });

      const { user } = await res.json();
      dispatch(signInSuccess(user));
      navigate("/profile");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      type="button"
      className=" cursor-pointer w-full flex items-center justify-center border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
    >
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google logo"
        className="w-5 h-5 mr-3"
      />
      Continue with Google
    </button>
  );
};

export default Oath;
