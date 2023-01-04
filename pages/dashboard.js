import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import Message from "../components/message";
import { BsTrash2Fill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import { MdOutlineComment } from "react-icons/md";
import Link from "next/link";
import { toast } from "react-toastify";

export default function Dashboard() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState([]);

  // checking if user is logged in and rendering only their posts
  const getData = async () => {
    if (loading) return;
    if (!user) return route.push("/auth/login");

    const collectionRef = collection(db, "posts");
    // getting only the posts that the user made
    const q = query(collectionRef, where("user", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe;
  };

  // to delete a post from
  const deletePost = async (id) => {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef);
    // throwing a pop that the post was deleted
    toast.success("Post has been deleted 😃", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 500,
    });
  };

  // to sign out the current google user
  const signOut = () => {
    auth.signOut();
  };

  //Get users data
  useEffect(() => {
    getData();
  }, [user, loading]);

  return (
    <div>
      <h1>Your posts</h1>
      <div>
        {posts.map((post) => {
          return (
            <Message {...post} key={post.id}>
              <div className="flex gap-4">
                <button
                  onClick={() => deletePost(post.id)}
                  className="text-pink-600 flex items-center justify-center gap-2 py-2 text-sm"
                >
                  <BsTrash2Fill className="text-2xl" />
                  Delete
                </button>

                <Link href={{ pathname: "/post", query: post }}>
                  <button className="text-teal-600 flex items-center justify-center gap-2 py-2 text-sm">
                    <AiFillEdit className="text-2xl" />
                    Edit
                  </button>
                </Link>

                <Link href={{ pathname: `/${post.id}`, query: { ...post } }}>
                  <button className="text-black-600 flex items-center justify-center gap-2 py-2 text-sm">
                    <MdOutlineComment className="text-2xl" />
                    {post.comments?.length > 0 ? post.comments?.length : 0}{" "}
                    comments
                  </button>
                </Link>
              </div>
            </Message>
          );
        })}
      </div>
      <button
        className="font-medium text-white bg-gray-800 py-2 px-4 my-6"
        onClick={() => signOut()}
      >
        Sign out
      </button>
    </div>
  );
}
