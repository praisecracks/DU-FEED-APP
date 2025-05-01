import { ref } from "firebase/storage";
import img from "../Asset/Book study.jpg";
import { db } from "./Firebase";
function getUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const piece = (Math.random() * 16) | 0;
    const elem = c === "x" ? piece : (piece & 0x3) | 0x8;
    return elem.toString(16);
  });
}
// const q = query(collection(db, "Contact"));
// const unsub = onSnapshot(q, (querySnapshot) => {
//     let StreamArrey = [];
//     querySnapshot.forEach((doc) => {
//         StreamArrey.push({ ...doc.data(), id: doc.id });
//     });
//     setContacts(StreamArrey);
const FetchBlogs = async () => {
  try {
    const blogRef = ref(db, "Blogs");
    const snapshot = await get(blogRef);

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No BLog Found");
    }
  } catch (error) {
    console.log(error + "error fetching ");
  }
};
export const Blogs = FetchBlogs()
export const Blogs1 = [
  {
    id: getUUID(),
    image: img,
    authId: 123456789,
    title: "Lorem ipsum dolor sit, amet consectetur adipisicing elit.",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo sed excepturi dolores beatae totam tempore. Inventore deleniti nemo distinctio nostrum!",
    likes: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    date: "2024-12-01",
    isVerified: true,
  },
  {
    id: getUUID(),
    image: img,
    authId: 123456789,
    title: "Lorem ipsum dolor sit, amet consectetur adipisicing elit.",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo sed excepturi dolores beatae totam tempore. Inventore deleniti nemo distinctio nostrum!",
    likes: [1, 2, 3, 4],
    date: "2024-12-01",
    isVerified: true,
  },
  {
    id: getUUID(),
    image: img,
    authId: 123456789,
    title: "Lorem ipsum dolor sit, amet consectetur adipisicing elit.",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo sed excepturi dolores beatae totam tempore. Inventore deleniti nemo distinctio nostrum!",
    likes: [1, 2, 3, 4],
    date: "2024-12-01",
    isVerified: true,
  },
  {
    id: getUUID(),
    title: "Tech Trends",
    date: "2024-12-01",
    isVerified: false,
    type: "New Report",
    desc: "lorem2 The content you provided already matches the document. If you're expecting new changes, could you clarify what you'd like adjusted or enhanced? so am sure you know what am doing and why am doing thisso am sure you know what am doing and why am doing this so am sure you know what am doing and why am doing this so am sure you know what am doing and why am doing this so am sure you know what am doing and why am doing this The content you provided already matches the document. If you're expecting new changes, could you clarify what you'd like adjusted or enhanced? so am sure you know what am doing and why am doing thisso am sure you know what am doing and why am doing this so am sure you know what am doing and why am doing this so am sure you know what am doing and why am doing this so am sure you know what am doing and why am doing thi",
    likes: [1, 2, 3, 4, 5, 6],
    image: img,
    authId: 13,
  },
  {
    id: getUUID(),
    title: "Tech Trends",
    date: "2024-12-01",
    isVerified: true,
    type: "New Report",
    desc: "lorem2 The content you provided already matches the document. If you're expecting new changes, could you clarify what you'd like adjusted or enhanced? so am sure you know what am doing and why am doing thisso am sure you know what am doing and why am doing this so am sure you know what am doing and why am doing this so am sure you know what am doing and why am doing this so am sure you know what am doing and why am doing this The content you provided already matches the document. If you're expecting new changes, could you clarify what you'd like adjusted or enhanced? so am sure you know what am doing and why am doing thisso am sure you know what am doing and why am doing this so am sure you know what am doing and why am doing this so am sure you know what am doing and why am doing this so am sure you know what am doing and why am doing thi",
    likes: [1, 2, 3, 4, 5],
    image: img,
    authId: 13,
  },
  {
    id: getUUID(),
    title: "Year in Review for the Semester",
    date: "2024-12-05",
    type: "Event Report",
    image: img,
    authId: 13,
    isVerified: false,
    desc: "am sure you know what am doing and why am doing this so am sure you know what am doing The content you provided already matches the document. If you're expecting new changes, could you clarify what you'd like adjusted or enhanced? so am sure you know what am doing and why am doing thisso at am doing provided already matches the document. If you're expecting new changes, could you clarify what you'd like adjusted or enhanced? so am sure you know what am doing and why am doing thisso am sure you know what am doing and why am doing this so am sure you know what am doing and why am doing this so am sure you know what am doing and why am doing this so am sure you know what am doing and why am doing thi and why am doing this so am sure you know what am doing and why am doing this so am sure you know what am doing and why am doing this",
    likes: [1, 2, 3, 4],
  },
  {
    id: getUUID(),
    title: "Year in Review for the Semester",
    date: "2024-12-05",
    isVerified: true,
    type: "Event Report ",
    desc: "lorem2 The content you provided already matches the document. If you're expecting new changes, could you clarify what you'd like adjusted or enhanced? so am sure you know what am doing and why am doing thisso am sure you know what am doing and why am doing this so am sure you know what am doing and why am doing this so am sure you know what am doing and why am doing this so am sure you know what am doing and why am doing this The content you provided already matches the document. If you're expecting new changes, could you clarify what you'd like adjusted or enhanced? so am sure you know what am doing and why am doing thisso am sure you know what am doing and why am doing this so am sure you know what am doing and why am doing this so am sure you know what am doing and why am doing this so am sure you know what am doing and why am doing thi",
    likes: [1, 2, 3, 4],
    image: img,
    authId: 123456789,
  },
  {
    id: getUUID(),
    title: "Upcoming Innovations",
    date: "2024-12-10",
    image: img,
    authId: 13,
    isVerified: false,
    type: "New Report",
    desc: "lorem2 The content you provided already matches the document. If you're expecting new changes, could you clarify what you'd like adjusted or enhanced? so am sure you know what am doing and why am doing thisso am sure you know what am doing and why am doing this so am sure you know what am doing and why am doing this so am sure you know what am doing and why am doing this so am sure you know what am doing and why am doing this",
    likes: [1, 2, 3, 4],
  },
];

export const SingleBlogs = [];

export const truncate = (str, n) => {
  return str?.length > n ? str.substr(0, n - 1) + " . . . . " : str;
};


const FetchUsers = async () => {
  try {
    const blogRef = ref(db, "Users");
    const snapshot = await get(blogRef);

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No BLog Found");
    }
  } catch (error) {
    console.log(error + "error fetching ");
  }
};


export const Users = FetchUsers()
export const Users1 = [
  {
    uid: 123456789,
    email: "ww@ww",
    name: "solomon",
    isAdmin: false,
  },
  {
    uid: 1234,
    email: "ww@ww",
    name: "solomon",
    isAdmin: false,
  },
  {
    uid: 123,
    email: "ww@ww",
    name: "solomon",
    isAdmin: false,
  },
];
