import { useState,useEffect } from 'react'
import { Link } from 'react-router';


interface ProductImage {
  url: string;
  _id: string;
}

interface Product {
  _id: string;
  userId: string;
  name: string;
  description: string;
  price: number;
  inStock: boolean;
  quantity: number;
  category: string;      // Agar aapne populate kiya hai to 'Category' interface use karein
  subCategory: string;
  childCategory: string;
  productImages: ProductImage[];
  createdAt: string;     // Ya Date agar aap convert kar rahe hain
  updatedAt: string;
  __v: number;
}

function App() {
  const [products,setProducts] = useState<Product[]>([]);


useEffect(() => {
  fetch("http://localhost:3002/api/allProducts")
    .then((response) => response.json()) // Pehle response ko JSON mein convert karein
    .then((data) => {
      console.log(data); // Yahan aapka data mil jayega
      setProducts(data.products); 
    })
    .catch((error) => console.error("Error:", error)); // Error handling
}, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-slate-900 text-white py-8 px-4 text-center shadow-md">
        <h1 className="text-3xl font-bold tracking-tight"> Product listing</h1>
        <p className="text-slate-400 mt-2">Stripe Checkout Testing Environment</p>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Featured Services</h2>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
            v4 Active
          </span>
        </div>
        
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          { products &&  products.map((product) => (
            <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <img 
                src={product.productImages[0]?.url} 
                alt={product.name} 
                className="w-full h-48 object-cover"
              />
              
              <div className="p-5">
               
                <h3 className="text-lg font-bold mt-1 text-gray-800">{product.name}</h3>
                <p className="text-xl font-black text-slate-900 mt-2">
                  Rs. {product.price.toLocaleString()}
                </p>
                
                {/* Stripe Test Button */}
                <Link to={`/product/${product._id}`}>
                  <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors active:scale-95">
                    Buy Now
                  </button>
                </Link>
                
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="mt-12 py-6 text-center text-gray-500 text-sm border-t">
        &copy; 2026 AutoTrans World - Stripe Integration Lab
      </footer>
    </div>
  )
}

export default App