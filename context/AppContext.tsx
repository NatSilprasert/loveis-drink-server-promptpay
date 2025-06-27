'use client'

import axios from "axios";
import { useRouter, useRouter as UseRouterType } from "next/navigation";
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import toast from "react-hot-toast";

// Define the context type

interface AppContextType {
    router: ReturnType<typeof useRouter>;
    products: Product[];
    login: Login;
    setLogin: React.Dispatch<React.SetStateAction<Login>>;
    showLogin: boolean;
    setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
    showPayment: boolean;
    setShowPayment: React.Dispatch<React.SetStateAction<boolean>>;
    showSlip: string;
    setShowSlip: React.Dispatch<React.SetStateAction<string>>;
    openEdit: string;
    setOpenEdit: React.Dispatch<React.SetStateAction<string>>;
    addToCart: (drink: Drink) => void;
    removeFromCart: (drink: Drink) => void;
    getCartCount: () => number;
    getCartAmount: () => number;
    cartItems:  Drink[];
    setCartItems: React.Dispatch<React.SetStateAction<Drink[]>>;
    orderItems:  object[];
    setOrderItems: React.Dispatch<React.SetStateAction<object[]>>;
    adminToken: string;
    setAdminToken: React.Dispatch<React.SetStateAction<string>>;
    fetchUserData: () => void;
}

interface AppContextProviderProps {
    children: ReactNode;
}

export interface Login {
    seat: string;
    round: string;
}

export interface Product {
    _id: any;
    name: string;
    price: number;
    description: string;
    imageUrl: any;
    category: string;
    option: string[];
    bestseller: boolean;
    signature: boolean;
}
export interface Drink {
    productId: string;
    price: number;
    option: string;
    selectedTime: string;
    addon: string[];
    request: string;
    quantity: number;
}

// Function

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppContextProvider");
    }
    return context;
}

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
    
    const router = useRouter();

    // Admin
    const [adminToken, setAdminToken] = useState<string>('');
    const [openEdit, setOpenEdit] = useState<string>('');
    const [showSlip, setShowSlip] = useState<string>('');

    const [login, setLogin] = useState<Login>({seat: 'guest', round: 'กรอกที่นั่ง'});
    const [showLogin, setShowLogin] = useState<boolean>(false);
    const [showPayment, setShowPayment] = useState<boolean>(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [cartItems, setCartItems] = useState<Drink[]>([]);
    const [orderItems, setOrderItems] = useState<object[]>([]);
    const [refreshUser, setRefreshUser] = useState(false);

    // Admin Token
    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            setAdminToken(token);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('adminToken', adminToken);
    }, [adminToken]);

    // User Token

    useEffect(() => {
        const loginStr = localStorage.getItem('login');
        if (loginStr) {
            setLogin(JSON.parse(loginStr));
        } else {
            setShowLogin(true)
        }
    }, []);

    useEffect(() => {
        if (login && login.seat !== 'guest') {
            localStorage.setItem('login', JSON.stringify(login));
        }
    }, [login]);

    // Fetch Product Data

    useEffect(() => {
        fetchProductData();
    },[openEdit])

    // Fetch User Data 

    useEffect(() => {
        fetchUserData();
    }, [login, refreshUser])

    // Fetch Function

    const fetchProductData = async () => {

        try {
            
            const response = await axios.get('/api/product/list');

            if (response.data.success) {
                setProducts(response.data.products)
            } else {
                console.log(response.data.message)
            }

        } catch (error: any) {
            console.log(error)
            toast.error(error.message)
        }

    }

    const fetchUserData = async () => {

        try {

            const { seat, round } = login
            const response = await axios.post('/api/user/get', { seat, round });

            if (response.data.success) {    
                const { cartData, orderData } = response.data;
                setCartItems(cartData)
                setOrderItems(orderData)
            }
            
        } catch (error: any) {
            console.log(error)
            toast.error(error.message)
        }

    }

    // Cart Function

    const addToCart = async (drink: Drink) => { 

        try {
            const { seat, round } = login;
            const response = await axios.post('/api/cart/add', {seat, round, drink});
            if (response.data.success) {
                toast.success(response.data.message)
                setRefreshUser(r => !r);
            } else {
                toast.error(response.data.message)
            }
        } catch (error: any) {
           console.log(error)
           toast.error(error.message) 
        }

    }

    const removeFromCart = async (drink: Drink) => {

        try {
            const { seat, round } = login;
            const response = await axios.post('/api/cart/remove', {seat, round, drink});
            if (response.data.success) {
                toast.success(response.data.message)
                setRefreshUser(r => !r);
            } else {
                toast.error(response.data.message)
            }
        } catch (error: any) {
           console.log(error)
           toast.error(error.message) 
        }

    }

    const getCartCount = () => {

        let totalCount = 0;
        for (const item of cartItems) {
            totalCount += item.quantity;
        }

        return totalCount

    }

    const getCartAmount = () => {

        let totalAmount = 0;
        for (const item of cartItems) {
            totalAmount += item.price * item.quantity;
        }

        return totalAmount

    }

    const value: AppContextType = {
        router, products, fetchUserData,
        adminToken, setAdminToken, openEdit, setOpenEdit,
        login, setLogin, showLogin, setShowLogin,
        addToCart, removeFromCart, getCartCount, getCartAmount,
        cartItems, setCartItems, orderItems, setOrderItems,
        showPayment, setShowPayment, showSlip, setShowSlip
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

