'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CatalogProduct } from '@/lib/catalog';

export interface CartItem {
    product: CatalogProduct;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: CatalogProduct, quantity?: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    totalCount: number;
    totalPrice: number;
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('impextech_cart');
            if (saved) {
                setItems(JSON.parse(saved));
            }
        } catch (e) {
            console.warn('Failed to load cart from localStorage:', e);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // Save cart to localStorage on change
    useEffect(() => {
        if (!isLoaded) return;
        try {
            localStorage.setItem('impextech_cart', JSON.stringify(items));
        } catch (e) {
            console.warn('Failed to save cart to localStorage:', e);
        }
    }, [items, isLoaded]);

    const addToCart = (product: CatalogProduct, quantity = 1) => {
        setItems(prev => {
            const existingIndex = prev.findIndex(item => item.product.id === product.id);
            if (existingIndex > -1) {
                const next = [...prev];
                next[existingIndex] = {
                    ...next[existingIndex],
                    quantity: next[existingIndex].quantity + quantity
                };
                return next;
            }
            return [...prev, { product, quantity }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (productId: string) => {
        setItems(prev => prev.filter(item => item.product.id !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setItems(prev => prev.map(item => {
            if (item.product.id === productId) {
                return { ...item, quantity };
            }
            return item;
        }));
    };

    const clearCart = () => {
        setItems([]);
    };

    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.product.priceNgn * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalCount,
            totalPrice,
            isCartOpen,
            setIsCartOpen
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
