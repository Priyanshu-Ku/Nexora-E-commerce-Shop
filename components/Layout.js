import { useContext, useEffect, useState } from "react";
import Footer from "./Footer";
import { ProductsContext } from "./ProductsContext";

export default function Layout({children}) {
    const {setSelectedProducts} = useContext(ProductsContext);
    const [success,setSuccess] = useState(false);
    useEffect(() => {
        if (window.location.href.includes('success')) {
            setSelectedProducts([]);
            setSuccess(true);
        }
    }, []);
    return (
        <div>
            <div className="p-5">
                {success && (
                    <div className="mb-5 bg-blue-400 text-white text-lg p-5 rounded-xl">
                        Thanks for your order! Your payment has been confirmed.
                    </div>
                )}
                {children}
            </div>
            <Footer />
        </div>
    );
}