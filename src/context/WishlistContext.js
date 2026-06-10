import { createContext, useContext, useState } from "react";
// state bucket / shared bucket / global class.


const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlistCount, setWishlistCount] = useState(0);

    return (
        <WishlistContext.Provider value={{wishlistCount, setWishlistCount}}>
           { children }
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);