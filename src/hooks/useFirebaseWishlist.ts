/**
 * Hook to sync wishlist with Firebase
 */

import { useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlistStore } from "@/app/store/wishlistStore";
import {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  type Favorite,
} from "@/lib/firebase/userActivity";

interface Product {
  id: number;
  name: string;
  image: string;
  category: string;
}

export function useFirebaseWishlist() {
  const { user } = useAuth();
  const { wishlist, setWishlist, toggleWishlist } = useWishlistStore();

  // Load wishlist from Firebase when user logs in
  useEffect(() => {
    if (user) {
      loadWishlistFromFirebase();
    }
  }, [user]);

  const loadWishlistFromFirebase = async () => {
    if (!user) return;

    try {
      const favorites = await getFavorites(user.uid);
      const ids = favorites.map((fav) => fav.id);
      setWishlist(ids);
    } catch (error) {
      console.error("Error loading wishlist from Firebase:", error);
    }
  };

  const syncToggleWishlist = useCallback(
    async (productId: number, product?: Product) => {
      // Toggle locally first for instant feedback
      toggleWishlist(productId);

      // Sync with Firebase if user is logged in
      if (user) {
        try {
          const isAdding = !wishlist.includes(productId);

          if (isAdding && product) {
            await addToFavorites(user.uid, {
              id: product.id,
              name: product.name,
              image: product.image,
              category: product.category,
              addedAt: null, // Will be set by Firebase
            });
          } else {
            await removeFromFavorites(user.uid, productId);
          }
        } catch (error) {
          console.error("Error syncing wishlist with Firebase:", error);
          // Revert local change if Firebase sync fails
          toggleWishlist(productId);
        }
      }
    },
    [user, wishlist, toggleWishlist]
  );

  return {
    wishlist,
    toggleWishlist: syncToggleWishlist,
    refreshWishlist: loadWishlistFromFirebase,
  };
}

