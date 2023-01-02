import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Router, useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";

export default function Post() {
  // to help get post value from the text area which will be an object with a string field
  const [post, setPost] = useState({ description: "" });
  const [user, loading] = useAuthState(auth);
  const route = useRouter();
  const routeData = route.query;

  // to submit post
  const submitPost = async (e) => {
    // when a button is usually pressed the page refreshes we will stop that
    e.preventDefault();

    // run checks for description
    // nothing to post
    if (!post.description) {
      toast.error("Description field is empty 😅", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 500,
      });
      return; // exit function
    }
    // post is too long
    if (post.description.length > 300) {
      toast.error("Description field is too long 😅", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 500,
      });
      return; // exit function
    }

    // if the post has an id update the post
    if (post?.hasOwnProperty("id")) {
      // updating post
      const docRef = doc(db, "posts", post.id);
      const updatedPost = { ...post, timestamp: serverTimestamp() };
      await updateDoc(docRef, updatedPost);

      // clearing out the post after it was updated
      setPost({ description: "" });

      // having a pop up that says the post has been updated
      toast.success("Post has been updated 😃", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 500,
      });

      // exit function and page and go back to home page
      return route.push("/");
    }

    // making a new post
    const collectionRef = collection(db, "posts");
    await addDoc(collectionRef, {
      ...post,
      timestamp: serverTimestamp(),
      user: user.uid,
      avatar: user.photoURL,
      username: user.displayName,
    });

    // clearing out the post after it is submitted
    setPost({ description: "" });

    // having a pop up that says the post has been submitted
    toast.success("Post has been made 😃", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 500,
    });

    // when post is submitted go to the homepage and exit function and page
    return route.push("/");
  };

  // check our user
  const checkUser = async () => {
    // if loading exit function
    if (loading) return;
    // if there is no signed in user take them to the login page
    if (!user) route.push("/auth/login");

    // if there is an id in the route set the post
    if (routeData.id) {
      setPost({ description: routeData.description, id: routeData.id });
    }
  };

  // will call check user
  useEffect(() => {
    checkUser();
  }, [user, loading]);

  return (
    <div className="my-20 p-12 shadow-lg rounded-lg max-w-md mx-auto">
      <form onSubmit={submitPost}>
        <h1 className="text-2xl font-bold ">
          {post.hasOwnProperty("id") ? "Edit your post" : "Create a new post"}
        </h1>
        <div className="py-2">
          <h3 className="text-lg font-medium py-2">Description</h3>
          <textarea
            value={post.description}
            onChange={(e) => setPost({ ...post, description: e.target.value })}
            className="bg-gray-800 h-48 w-full text-white rounded-lg p-2 text-sm"
          ></textarea>
          <p
            className={`text-cyan-600 font-medium text-sm ${
              post.description.length > 300 ? "text-red-600" : ""
            }`}
          >
            {post.description.length}/300
          </p>
        </div>
        <button
          type="submit"
          className="w-full bg-cyan-600 text-white font-medium p-2 my-2 rounded-lg text-sm"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
