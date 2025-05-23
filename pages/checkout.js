import { useContext, useEffect, useState } from "react";
import Layout from "../components/Layout";
import { ProductsContext } from "../components/ProductsContext";


export default function CheckoutPage() {
    const {selectedProducts,setSelectedProducts} = useContext(ProductsContext);
    const [productsInfos,setProductsInfos] = useState([]);
    const [address,setAddress] = useState('');
    const [city,setCity] = useState('');
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');

    useEffect( () => {
        const uniqIds = [...new Set(selectedProducts)];
        fetch('/api/products?ids='+uniqIds.join(','))
        .then(response => response.json())
        .then(json => setProductsInfos(json));
    },[selectedProducts]);

    function moreOfThisProduct(id) {
        setSelectedProducts(prev => [...prev,id]);
    }
    function lessOfThisProduct(id){
        const pos = selectedProducts.indexOf(id);
        if (pos !== -1) {
            setSelectedProducts( prev => {
                return prev.filter((value,index) => index !== pos);
            });
        }
    }

    const deliveryPrice = 10;
    let subtotal = 0;
    if (selectedProducts?.length) {
        for (let id of selectedProducts) {
            const price = productsInfos.find(p => p._id === id)?.price || 0;
            subtotal += price;
        }
    }
    const total = subtotal + deliveryPrice;

    return (
        <Layout>
            {!productsInfos.length && (
                <div>no products in your shopping cart</div>
            )}
            {productsInfos.length && productsInfos.map(productInfo => {
                const amount = selectedProducts.filter(id => id === productInfo._id).length;
                if (amount === 0) return;
                return (
                <div className="flex mb-5 items-center" key={productInfo._id}>
                    <div className="bg-gray-100 p-3 rounded-xl shrink-0" style={{boxShadow:'inset 1px 0px 10px 10px rgba(0,0,0,0.1)'}}>
                        <img className="w-24" src={productInfo.picture} alt={productInfo.name} />
                    </div>
                    <div className="pl-4 items-center">
                        <h3 className="font-bold text-lg">{productInfo.name}</h3>
                        <p className="text-sm leading-4 text-gray-500">{productInfo.description}</p>
                        <div className="flex mt-1">
                            <div className="grow font-bold">Rs {new Intl.NumberFormat('en-IN').format(productInfo.price)}</div>
                            <div>
                                <button onClick={() => lessOfThisProduct(productInfo._id)} className="border border-blue-500 px-2 rounded-lg text-blue-500">-</button>
                                <span className="px-2">
                                    {selectedProducts.filter(id => id === productInfo._id).length}
                                </span>
                                <button onClick={() => moreOfThisProduct(productInfo._id)} className="bg-blue-500 px-2 rounded-lg text-white">+</button>
                            </div>
                        </div>
                    </div>
                </div>
            )})}
            {/* { {selectedProducts.join(',')} } Shows the ids of cartitems */}
            
            <form action="/api/checkout" method="POST">   
                <div className="mt-4">
                    <input name="name" value={name} onChange={e => setName(e.target.value)} className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2" type="text" placeholder="Your name"/>
                    <input name="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2" type="email" placeholder="Email address"/>
                    <input name="address" value={address} onChange={e => setAddress(e.target.value)} className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2" type="text" placeholder="Street address, number"/>
                    <input name="city" value={city} onChange={e => setCity(e.target.value)} className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2" type="text" placeholder="City and postal code"/>
                </div>
                <div className="mt-4">
                    <div className="flex my-3">
                        <h3 className="grow font-bold text-gray-400">Subtotal:</h3>
                        <h3 className="font-bold">Rs {new Intl.NumberFormat('en-IN').format(subtotal)}</h3>
                    </div>
                    <div className="flex my-3">
                        <h3 className="grow font-bold text-gray-400">Delivery:</h3>
                        <h3 className="font-bold">Rs {new Intl.NumberFormat('en-IN').format(deliveryPrice)}</h3>
                    </div>
                    <div className="flex my-3 border-t pt-2 border-dashed border-blue-500">
                        <h3 className="grow font-bold text-gray-400">Total:</h3>
                        <h3 className="font-bold">Rs {new Intl.NumberFormat('en-IN').format(total)}</h3>
                    </div>
                </div>
                <input type="hidden" name="products" value={selectedProducts.join(',')}/> {/* Sending hidden info about the products */}
                <button type="submit" className="bg-blue-500 px-5 py-2 rounded-xl font-bold text-white w-full my-4 shadow-blue-300 shadow-lg">Pay Rs {new Intl.NumberFormat('en-IN').format(total)}</button>
            </form>
        </Layout>
    );
}