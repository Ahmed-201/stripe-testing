import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Stripe ko initialize karein (Aapki Publishable Key)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ shippingData, clientSecret }: any) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsProcessing(true);

        const result = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Payment success ke baad yahan jayega
                return_url: `${window.location.origin}/order-success`,
                shipping: {
                    name: shippingData.userName,
                    address: { line1: shippingData.shippingAddress }
                }
            },
        });

        if (result.error) {
            alert(result.error.message);
        }
        setIsProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />
            <button 
                disabled={isProcessing || !stripe}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:bg-gray-400"
            >
                {isProcessing ? "Processing..." : "Pay Now"}
            </button>
        </form>
    );
};

function Checkout() {
    const [step, setStep] = useState(1);
    const [clientSecret, setClientSecret] = useState("");
    
    // Form States
    const [formData, setFormData] = useState({
        userName: '',
        shippingAddress: '',
        userId: 'USER_ID_FROM_AUTH', // Auth state se aye gi
    });

    // Step 1 Complete karke Payment Intent banana
    const proceedToPayment = async () => {

        if (!formData.userName || !formData.shippingAddress) {
            return alert("Please fill all shipping details");
        }
        // setStep(2);
        // Yahan aapki Backend API hit hogi jo clientSecret degi
        try {
            const response = await fetch("http://localhost:3002/api/createPaymentIntent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    ...formData,
                    items: JSON.parse(localStorage.getItem("cart") || "[]") 
                }),
            });
            console.log(response,"response")
            const data = await response.json();
            console.log(data,"data")
            setClientSecret(data.clientSecret);
            setStep(2); // Agle step par bhejein
        } catch (error) {
            console.error("Error creating payment intent", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-sm border p-8">
                
                {/* --- Step Indicator --- */}
                <div className="flex items-center justify-between mb-10">
                    <div className={`flex-1 text-center font-bold pb-2 border-b-4 ${step === 1 ? 'border-blue-600 text-blue-600' : 'border-gray-200 text-gray-400'}`}>1. Shipping</div>
                    <div className={`flex-1 text-center font-bold pb-2 border-b-4 ${step === 2 ? 'border-blue-600 text-blue-600' : 'border-gray-200 text-gray-400'}`}>2. Payment</div>
                </div>

                {step === 1 ? (
                    /* --- Step 1: Shipping Form --- */
                    <div className="space-y-5 animate-fadeIn">
                        <h2 className="text-2xl font-black text-gray-800">Shipping Details</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input 
                                type="text" 
                                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.userName}
                                onChange={(e) => setFormData({...formData, userName: e.target.value})}
                                placeholder="Enter your full name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
                            <textarea 
                                rows={3}
                                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.shippingAddress}
                                onChange={(e) => setFormData({...formData, shippingAddress: e.target.value})}
                                placeholder="House #, Street, City, Country"
                            />
                        </div>
                        <button 
                            onClick={proceedToPayment}
                            className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all"
                        >
                            Proceed to Payment
                        </button>
                    </div>
                ) : (
                    /* --- Step 2: Stripe Payment --- */
                    <div className="animate-fadeIn">
                        <h2 className="text-2xl font-black text-gray-800 mb-6">Card Information</h2>
                        {clientSecret && (
                            <Elements stripe={stripePromise} options={{ clientSecret }}>
                                <CheckoutForm shippingData={formData} clientSecret={clientSecret} />
                            </Elements>
                        )}
                        <button 
                            onClick={() => setStep(1)} 
                            className="mt-4 text-sm text-gray-500 hover:underline"
                        >
                            ← Back to Shipping
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Checkout;