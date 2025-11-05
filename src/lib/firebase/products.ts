/**
 * Firebase service for managing products
 */

import { firestore } from "@/firebase/firebase";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";

export interface Product {
  id: string;
  name: string;
  description?: string;
  price?: number;
  image: string;
  category: string;
  brand?: string;
  colors?: string[];
  sizes?: string[];
  inStock?: boolean;
  createdAt?: any;
  updatedAt?: any;
}

/**
 * Add a single product
 */
export async function addProduct(productData: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<string> {
  try {
    if (!firestore) throw new Error("Firestore not initialized");

    const productsRef = collection(firestore, "products");
    const newProductDoc = doc(productsRef);
    
    await setDoc(newProductDoc, {
      ...productData,
      id: newProductDoc.id,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      inStock: productData.inStock ?? true,
    });

    return newProductDoc.id;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
}

/**
 * Add multiple products from JSON
 */
export async function addProductsBulk(products: Omit<Product, "id" | "createdAt" | "updatedAt">[]): Promise<number> {
  try {
    if (!firestore) throw new Error("Firestore not initialized");

    let successCount = 0;

    for (const productData of products) {
      try {
        await addProduct(productData);
        successCount++;
      } catch (error) {
        console.error(`Failed to add product: ${productData.name}`, error);
      }
    }

    return successCount;
  } catch (error) {
    console.error("Error adding products in bulk:", error);
    throw error;
  }
}

/**
 * Get all products
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    if (!firestore) throw new Error("Firestore not initialized");

    const productsRef = collection(firestore, "products");
    const q = query(productsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      products.push(doc.data() as Product);
    });
    
    return products;
  } catch (error) {
    console.error("Error getting products:", error);
    return [];
  }
}

/**
 * Get a single product by ID
 */
export async function getProductById(productId: string): Promise<Product | null> {
  try {
    if (!firestore) throw new Error("Firestore not initialized");

    const productDocRef = doc(firestore, "products", productId);
    const productDoc = await getDoc(productDocRef);
    
    if (productDoc.exists()) {
      return productDoc.data() as Product;
    }
    return null;
  } catch (error) {
    console.error("Error getting product:", error);
    return null;
  }
}

/**
 * Update a product
 */
export async function updateProduct(productId: string, updates: Partial<Product>): Promise<void> {
  try {
    if (!firestore) throw new Error("Firestore not initialized");

    const productDocRef = doc(firestore, "products", productId);
    await updateDoc(productDocRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}

/**
 * Delete a product
 */
export async function deleteProduct(productId: string): Promise<void> {
  try {
    if (!firestore) throw new Error("Firestore not initialized");

    const productDocRef = doc(firestore, "products", productId);
    await deleteDoc(productDocRef);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}

/**
 * Check if admin user
 */
export function isAdmin(email: string | null | undefined): boolean {
  return email === "admin@gmail.com";
}

