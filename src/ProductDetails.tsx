import React, { useEffect, useState } from 'react';
import { Link, useParams,useNavigate } from 'react-router-dom';

// Interfaces (No change here)
interface ProductImage { url: string; _id: string; }
interface ProductDetail {
    _id: string; userId: string; name: string; description: string; price: number;
    inStock: boolean; quantity: number; category: string; subCategory: string;
    childCategory: string; productImages: ProductImage[]; createdAt: string;
    updatedAt: string; __v: number;
}
interface ProductResponse { data: ProductDetail; }

function ProductDetails() {

    const navigate=useNavigate();
    const { productId } = useParams(); // Route se ID uthayega
    const [product, setProduct] = useState<ProductResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0); // Pehli image active rakhi
// --- Nayi States ---
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);



  const loadCart = () => {
            const data = JSON.parse(localStorage.getItem("cart") || "[]");
            console.log(data,"datalocalstorage")
            setCartItems(data);
        };

    console.log(cartItems,"cartItemscartItems")

 const addToCart = () => {
    const p = product?.data;
    if (!p) return;

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const isExist = existingCart.find((item: any) => item.productId === p._id);

    let updatedCart;
    if (isExist) {
        updatedCart = existingCart.map((item: any) =>
            item.productId === p._id ? { ...item, quantity: item.quantity + 1 } : item
        );
    } else {
        updatedCart = [...existingCart, {
            productId: p._id,
            name: p.name,
            price: p.price,
            quantity: 1,
            image: p.productImages[0]?.url
        }];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    
    // 👈 State update karein taake console.log(cartItems) mein data nazar aaye
    setCartItems(updatedCart); 
    
    setIsCartOpen(true); 
};

const handleCheckout=()=>{

    navigate("/checkout")

}


// 3. Remove Item Function
    const removeItem = (id: string) => {
        const updated = cartItems.filter(item => item.productId !== id);
        localStorage.setItem("cart", JSON.stringify(updated));
        setCartItems(updated);
    };


    useEffect(() => {
        const getSingleProduct = async () => {
            try {
                const response = await fetch("http://localhost:3002/api/productById", {
                    method: "POST", // Body bhejni hai to POST ya PUT use karna hoga
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ productId: productId }),
                });
                const data = await response.json();
                setProduct(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching product:", error);
                setLoading(false);
            }
        };
        if (productId) getSingleProduct();

        loadCart();
    }, [productId]);

      console.log(product,"product===")

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <h3 className="text-2xl font-semibold text-gray-700 animate-pulse">Loading product...</h3>
        </div>
    );


        if (!product) return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <h3 className="text-2xl font-semibold text-red-600">Product nahi mila!</h3>
        </div>
    );

    const p = product.data; // Asani ke liye shortcut
   return (
    <div className="relative min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans overflow-x-hidden">
        
        {/* --- Main Product Detail Card --- */}
        <div className="max-w-7xl mx-auto bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
                
                {/* Left Side: Images */}
                <div className="flex flex-col gap-5">
                    <div className="w-full h-96 lg:h-[500px] overflow-hidden rounded-2xl bg-gray-100 border border-gray-200 shadow-inner flex items-center justify-center">
                        <img src={p.productImages[activeImage]?.url} alt={p.name} className="max-w-full max-h-full object-contain p-4 mix-blend-multiply" />
                    </div>
                    {p.productImages.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto pb-2">
                            {p.productImages.map((img, index) => (
                                <img key={img._id} src={img.url} onClick={() => setActiveImage(index)} className={`w-20 h-20 rounded-xl object-cover cursor-pointer border-2 transition-all ${activeImage === index ? 'border-blue-600' : 'border-gray-200'}`} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Side: Info */}
                <div className="flex flex-col">
                    <div className="mb-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${p.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {p.inStock ? "IN STOCK" : "OUT OF STOCK"}
                        </span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-950 mb-2">{p.name}</h1>
                    <p className="text-3xl font-bold text-blue-700 mb-6">${p.price.toLocaleString()}</p>
                    <div className="w-full h-px bg-gray-200 mb-6"></div>
                    <p className="text-gray-700 mb-8 leading-relaxed">{p.description}</p>
                    
                    <button 
                        onClick={addToCart}
                        disabled={!p.inStock}
                        className={`w-full py-4 rounded-xl text-lg font-semibold transition-all ${p.inStock ? 'bg-black text-white hover:bg-gray-800 shadow-lg active:scale-95' : 'bg-gray-400 text-white cursor-not-allowed'}`}
                    >
                        {p.inStock ? "Add to Cart" : "Currently Unavailable"}
                    </button>
                </div>
            </div>
        </div>

        {/* --- Floating Cart Side Drawer --- */}
        {/* Overlay (Background Blur) */}
        {isCartOpen && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity" onClick={() => setIsCartOpen(false)} />
        )}

        {/* Cart Panel */}
        <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                    <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Your Cart</h2>
                    <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white rounded-full border border-transparent hover:border-gray-200 transition-all text-gray-500 font-bold">✕</button>
                </div>

                {/* Items List */}
                <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-hide">
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 italic">
                            <p className="text-lg">Cart is empty</p>
                            <Link to="/" className="mt-4 text-blue-600 not-italic font-semibold underline">Continue Shopping</Link>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.productId} className="flex gap-4 items-center animate-fadeIn">
                                <div className="w-24 h-24 bg-gray-100 rounded-2xl flex-shrink-0 border p-2 overflow-hidden">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                </div>
                                <div className="flex-grow">
                                    <h4 className="font-bold text-gray-900 leading-tight mb-1 truncate w-40">{item.name}</h4>
                                    <p className="text-blue-700 font-bold mb-2">${item.price}</p>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center border rounded-lg bg-gray-50 overflow-hidden">
                                            <button className="px-2 py-1 hover:bg-gray-200 font-bold">-</button>
                                            <span className="px-3 py-1 font-semibold text-sm">{item.quantity}</span>
                                            <button className="px-2 py-1 hover:bg-gray-200 font-bold">+</button>
                                        </div>
                                        <button className="text-xs text-red-500 font-medium hover:underline"
                                        onClick={() => removeItem(item.productId)}
                                        >Remove</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer (Total & Checkout) */}
                <div className="p-6 border-t bg-gray-50">
                    <div className="flex justify-between text-xl font-black text-gray-900 mb-6">
                        <span>Subtotal:</span>
                        <span>${cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toLocaleString()}</span>
                    </div>
                    
                    
                    
                    
                    <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 text-lg uppercase tracking-widest"

                    onClick={handleCheckout}
                    
                    
                    >
                        Proceed to Checkout
                    </button>

                    
                    <p className="text-center text-xs text-gray-400 mt-4">Shipping & taxes calculated at checkout</p>
                </div>
            </div>
        </div>
    </div>
);
}

export default ProductDetails;