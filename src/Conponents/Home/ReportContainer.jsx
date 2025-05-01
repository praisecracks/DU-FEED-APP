/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import prof from "../../Asset/profileFilled.svg";
import { truncate } from "../../Context/data";
import { Link } from "react-router-dom";
import { db } from "../../Context/Firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

function ReportContainer() {
    const [isLoading, setIsLoading] = useState(false);
    const [Data, setData] = useState([]);



    useEffect(() => {
        setIsLoading(true);
        const q = query(collection(db, "Blogs"));
    
        const unsub = onSnapshot(q, (querySnapshot) => {
            const StreamArray = [];
            querySnapshot.forEach((doc) => {
                StreamArray.push({ ...doc.data(), id: doc.id });
            });
    
            // Sort by date descending (newest first)
            StreamArray.sort((a, b) => {
                if (a.date && b.date) {
                    return b.date.toDate() - a.date.toDate(); // Firestore Timestamp to JS Date
                }
                return 0;
            });
    
            setData(StreamArray);
            console.log(StreamArray);
            setIsLoading(false);
        });
    
        return () => unsub();
    }, []);
    
    

    const AllBlogs = Data.filter((e) => e.isVerified === true);

    return (
        <div className="w-full px-4 py-8 mt-[50px]">
            {isLoading ? (
                <div className="flex justify-center items-center min-h-[50vh] text-gray-500 text-lg">
                    Loading...
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {AllBlogs && AllBlogs.length > 0 ? (
                        AllBlogs.map((data) => (
                            <div
                                key={data.id}
                                className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col"
                            >
                                {/* Image Section */}
                                {data.image ? (
                                    <img
                                        src={data.image}
                                        alt="Blog Cover"
                                        className="h-[16rem] w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-[16rem] bg-gray-100 text-gray-700 p-4 text-center">
                                        <h1 className="font-bold text-xl mb-2">DU Local News</h1>
                                        <p className="text-sm">Image isn't available for this news.</p>
                                    </div>
                                )}

                                {/* Blog Text Content */}
                                <div className="flex flex-col flex-grow p-4">
                                    <h1 className="font-semibold text-lg mb-2 text-gray-800">
                                        {truncate(data.title, 20)}
                                    </h1>
                                    <p className="text-gray-600 mb-4 flex-grow" >
                                        {truncate(data.desc, 100)}
                                    </p>

                                    <Link to={`/blog/${data.id}`} className="w-full">
                                        <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition">
                                            Read More
                                        </button>
                                    </Link>
                                </div>

                                {/* Review Section */}
                                <div className="flex items-center justify-between border-t p-4  bg-gray-200 text-gray-700 text-sm">
                                    <div className="flex gap-2">
                                        <span>{data.likes?.length || 0} Likes</span>
                                        <span>{data.dislikes?.length || 0} Dislikes</span>
                                        <span>{data.comments?.length || 0} Comments</span>
                                    </div>
                                    <Link to={`/profile/${data.userId || 'undefined'}`}>
                                        <img
                                            src={data?.authorImg || prof}
                                            alt="User Profile"
                                            className="w-8 h-8 rounded-full object-cover"
                                        />  
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center w-full text-gray-500 text-lg">
                            No News or Event found.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

export default ReportContainer;
