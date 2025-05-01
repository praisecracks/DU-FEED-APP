import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Firebase';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState({});
    const [loading, setLoading] = useState(true);
    // useEffect(() => {
    //     const unsubscribe = onAuthStateChanged(auth, (user) => {
    //         setLoading(true)
    //         setUser(user); // Set user state to the current user or null
    //         setLoading(false)
    //     });

    //     return () => unsubscribe(); // Clean up subscription on unmount
    // }, []);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            // setCurrentUser(null);

            //   setCurrentUser({
            //     displayName: "solomon Thompson",
            //     photoURL: "",
            //     uid:123456789,
            //   });


            setLoading(false);
        });
        return unsubscribe;
    }, []);

    return (
        <UserContext.Provider value={{ currentUser }}>
            {!loading && children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};
