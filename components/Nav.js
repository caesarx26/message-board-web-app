import Link from "next/link";
import { useEffect } from "react";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
export default function Nav() {
  const [user, loading] = useAuthState(auth);

  // to get the photo url from the google user
  const getPhotoURL = () => {
    const photoURL = user.photoURL;
    console.log("photo url: ");
    console.log(photoURL);
    return photoURL;
  };

  return (
    <nav className="flex justify-between items-center py-10">
      <Link href="/">
        <button className="text-lg font-medium">Message Board</button>
      </Link>

      <ul className="flex items-center gap-10">
        {!user && (
          <Link legacyBehavior href={"/auth/login"}>
            <a className="py-2 px-4 text-sm bg-cyan-500 text-white rounded-lg font-medium ml-8">
              Join Now
            </a>
          </Link>
        )}

        {user && (
          <div className="flex items-center gap-6">
            <Link href={{ pathname: "/post" }}>
              <button className="font-medium bg-cyan-500 text-white py-2 px-4 rounded-mg text-sm">
                Post
              </button>
            </Link>

            <Link href="/dashboard">
              <img
                src={getPhotoURL()}
                alt="profile picture"
                className="w-12 rounded-full cursor-pointer"
              />
            </Link>
          </div>
        )}
      </ul>
    </nav>
  );
}
