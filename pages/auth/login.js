// getting google icon from react icons
//  import the name and from will be react-icons/firstTwoLetters
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";

export default function login() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);

  // sign in with google
  const googleProvider = new GoogleAuthProvider();
  const GoogleLogin = async () => {
    // will have a popup show up for the user to sign in with google
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // will go back to the home page
      route.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  // checking if user is signed in and if they are take them to the home page
  useEffect(() => {
    if (user) {
      route.push("/");
    } else {
      console.log("logins");
    }
  }, [user]);

  return (
    <div className="shadow-xl mt-32 p-10 text-grey-700 rounded-lg">
      <h2 className="text-2xl font-medium">Join Today</h2>
      <div className="py-4">
        <h3 className="py-4">Sign in with one of the providers</h3>
        <button
          onClick={GoogleLogin}
          className="text-white bg-gray-700 w-full font-medium rounded-lg flex align-middle p-4 gap-2"
        >
          <FcGoogle className="text-2xl" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
