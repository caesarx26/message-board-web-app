import Message from "../components/message";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { toast } from "react-toastify";
import {
  arrayUnion,
  Timestamp,
  updateDoc,
  getDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

// goes to this page when home/combination of letters or numbers is linked to
// dynamic page which will be for rendering out comments and making comments
export default function Details() {
  const router = useRouter();
  const routeData = router.query;
  const [message, setMessage] = useState("");
  // will send an array to the database
  const [allMessages, setAllMessages] = useState([]);

  // submit a message
  const submitMessage = async () => {
    // check if user is logged in and if not go to the login page
    if (!auth.currentUser) return router.push("/auth/login");

    // if message is empty send exit function and throw a pop up on screen
    if (!message) {
      toast.error("Don't leave an empty comment 😅", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 500,
      });
      return; // exit function
    }

    // if message is too long throw a pop up on screen and exit function
    if (message.length > 300) {
      toast.error("Comment is too long 😅", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 500,
      });
      return; // exit function
    }

    // adding a comment into the document
    const docRef = doc(db, "posts", routeData.id);
    await updateDoc(docRef, {
      comments: arrayUnion({
        message,
        avatar: auth.currentUser.photoURL,
        userName: auth.currentUser.displayName,
        time: Timestamp.now(),
      }),
    });

    // throwing a pop that the comment was made
    toast.success("Comment has been made 😃", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 500,
    });

    // reset message
    setMessage("");
  };

  // get comments
  const getComments = async () => {
    // checking if the route data id does not exit
    // this happens when you go to this page on you own by typing it in and not by a comment link
    if (!routeData.id) {
      // exit function and go to the home page
      return router.push("/");
    }
    const docRef = doc(db, "posts", routeData.id);

    // will continuously set all messages made so you don't need to refresh when making a new comment
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      // try setting all messages but comments might be undefined when deleting a post
      try {
        setAllMessages(snapshot.data().comments);
      } catch (err) {
        // print error in console and exit function
        console.error(err);
        return;
      }
    });
    console.log("comments succeeded");
    return unsubscribe;
  };

  // will keep calling get comments until the router is ready to get data
  useEffect(() => {
    // router is not ready so exit function for now
    if (!router.isReady) return;
    getComments();
  }, [router.isReady]);
  return (
    <div>
      <Message {...routeData}></Message>

      <div className="my-4">
        <div className="">
          <textarea
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            value={message}
            placeholder="Leave a comment 😄"
            className="bg-gray-800 w-full p-2 text-white text-sm"
          ></textarea>

          <p
            className={`text-cyan-600 font-medium text-sm float-left
            ${message.length > 300 ? "text-red-600" : ""}`}
          >
            {message.length}/300
          </p>

          <button
            onClick={submitMessage}
            className="bg-cyan-500 text-white py-2 px-4 text-sm float-right"
          >
            Submit
          </button>
        </div>
        <div className="py-6">
          <h2 className="font-bold">Comments</h2>
          {allMessages?.map((message) => (
            <div className="bg-white p-4 my-4 border-2" key={message.time}>
              <div className="flex items-center gap-2 mb-4">
                <img
                  className="w-10 rounded-full"
                  src={message.avatar}
                  alt=""
                />
                <h2>{message.userName}</h2>
              </div>
              <h2>{message.message}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
