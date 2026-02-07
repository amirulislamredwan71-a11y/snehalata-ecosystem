import React, { useState, useEffect } from 'react';
import { useParams, Link } from '../components/Navigation';
import { getProducts } from '../services/mockData';
import { Product } from '../types';
import { ArrowLeft, Upload, Sparkles, RefreshCcw, Camera } from 'lucide-react';
import { generateTryOnTransformation } from '../services/geminiService';

export const VirtualTryOn: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const found = getProducts().find(p => p.id === Number(id));
      setProduct(found);
      // Convert product image URL to base64 (mocking by fetching) if we were in a real env, 
      // but here we just pass the URL if it was a data URL, or we rely on the backend to handle it.
      // For this demo, we'll need to fetch the image to blob to base64 to send to Gemini.
    }
  }, [id]);

  const convertUrlToBase64 = async (url: string): Promise<string> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result as string);
        setGeneratedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!userImage || !product) return;
    setIsProcessing(true);
    setError(null);

    try {
        // In a real app, we need to convert the product image URL to Base64 to send to Gemini
        // For the mock data (picsum), this fetch might fail due to CORS in some browsers/env.
        // If it fails, we mock the success.
        let productBase64 = "";
        try {
             productBase64 = await convertUrlToBase64(product.imageUrl);
        } catch (e) {
            console.warn("Could not fetch product image for base64 (CORS?). Using fallback.");
            // If we can't fetch the product image due to CORS (likely with picsum),
            // we will simulate the try-on process or show an error.
            // However, to satisfy the prompt, we will proceed.
            // NOTE: In production, images should be hosted on same domain or allow CORS.
            setError("Product image access restricted (CORS). Try uploading a product image manually in a real scenario.");
            setIsProcessing(false);
            return;
        }

        const result = await generateTryOnTransformation(userImage, productBase64);
        
        if (result) {
            setGeneratedImage(result);
        } else {
            setError("AI transformation failed. Please try a clearer photo.");
        }
    } catch (err) {
        setError("An error occurred during processing.");
    } finally {
        setIsProcessing(false);
    }
  };

  if (!product) return <div className="text-white text-center p-10">Product not found.</div>;

  return (
    <div className="min-h-screen bg-black pb-20">
       <div className="max-w-7xl mx-auto px-6 py-10">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
             <ArrowLeft size={16} /> Back to Hub
          </Link>

          <h1 className="text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-white mb-2">
            AI Virtual Try-On
          </h1>
          <p className="text-gray-400 mb-10 max-w-xl">
            Upload your photo to see how this item fits you. Powered by Aura Vision (Gemini 2.5).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* Input Section */}
            <div className="space-y-6">
                {/* User Photo Upload */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 relative group hover:border-aura-purple/50 transition-colors h-[400px] flex flex-col items-center justify-center border-dashed">
                    {userImage ? (
                        <div className="relative w-full h-full rounded-2xl overflow-hidden">
                            <img src={userImage} alt="You" className="w-full h-full object-cover" />
                            <button 
                                onClick={() => setUserImage(null)}
                                className="absolute top-2 right-2 bg-black/60 p-2 rounded-full text-white hover:bg-red-500 transition-colors"
                            >
                                <RefreshCcw size={16} />
                            </button>
                        </div>
                    ) : (
                        <label className="cursor-pointer flex flex-col items-center gap-4 text-center">
                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-aura-purple/20 transition-colors">
                                <Camera size={32} className="text-aura-purple" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Upload Your Photo</h3>
                                <p className="text-sm text-gray-500 mt-1">Full body or half body shots work best</p>
                            </div>
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                    )}
                </div>

                {/* Product Preview (Small) */}
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                     <img src={product.imageUrl} alt="Product" className="w-16 h-16 rounded-lg object-cover" />
                     <div>
                         <h4 className="font-bold text-white text-sm">{product.name}</h4>
                         <p className="text-gray-400 text-xs">৳{product.price.toLocaleString()}</p>
                     </div>
                </div>

                <button 
                    onClick={handleGenerate}
                    disabled={!userImage || isProcessing}
                    className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all ${
                        !userImage || isProcessing 
                        ? 'bg-white/10 text-gray-500 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-aura-purple to-indigo-600 hover:scale-[1.02] text-white shadow-lg shadow-purple-900/40'
                    }`}
                >
                    {isProcessing ? (
                        <>
                           <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                           Processing AI...
                        </>
                    ) : (
                        <>
                           <Sparkles size={18} /> Generate Preview
                        </>
                    )}
                </button>
                {error && <p className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded-lg border border-red-500/20">{error}</p>}
            </div>

            {/* Output Section */}
            <div className="bg-aura-glass border border-aura-glassBorder rounded-3xl p-1 relative overflow-hidden h-[600px] flex items-center justify-center">
                 {generatedImage ? (
                     <img src={generatedImage} alt="Generated Try-On" className="w-full h-full object-cover rounded-2xl animate-in fade-in duration-700" />
                 ) : (
                     <div className="text-center space-y-4 opacity-30">
                         <Sparkles size={64} className="mx-auto" />
                         <p className="font-serif text-2xl uppercase tracking-widest">Aura Vision</p>
                         <p className="text-sm">AI Magic will appear here</p>
                     </div>
                 )}
                 
                 {/* Decorative background elements */}
                 <div className="absolute inset-0 bg-gradient-to-t from-aura-purple/10 to-transparent pointer-events-none" />
            </div>

          </div>
       </div>
    </div>
  );
};