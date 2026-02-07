import React, { useState, useEffect } from 'react';
import { getVendors, getProductsByVendor } from '../services/mockData';
import { Product, Vendor } from '../types';
import { Plus, ShieldCheck, AlertTriangle, Globe, X, Save, Rocket, Zap, CheckCircle2, Bot } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';

export const VendorDashboard: React.FC = () => {
  // Simulating logged-in vendor (ID 1 for demo purposes)
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Website Generator State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [websiteUrl, setWebsiteUrl] = useState<string | null>(null);

  // Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    externalUrl: '',
    category: '',
    description: ''
  });

  useEffect(() => {
    // Simulate fetching current vendor data
    const currentVendor = getVendors().find(v => v.id === 1);
    if (currentVendor) {
      setVendor(currentVendor);
      setProducts(getProductsByVendor(currentVendor.id));
    }
  }, []);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor) return;

    const product: Product = {
      id: Date.now(), // Mock ID
      vendorId: vendor.id,
      name: newProduct.name,
      price: Number(newProduct.price),
      externalUrl: newProduct.externalUrl || undefined,
      category: newProduct.category || 'General',
      description: newProduct.description,
      imageUrl: `https://picsum.photos/400/600?random=${Date.now()}`
    };

    setProducts([product, ...products]);
    setIsFormOpen(false);
    setNewProduct({ name: '', price: '', externalUrl: '', category: '', description: '' });
  };

  const handleGenerateWebsite = () => {
    if (!vendor) return;
    setIsGenerating(true);
    setGenerationStep(1);

    // Simulate generation process
    setTimeout(() => setGenerationStep(2), 1500); // Allocating Subdomain
    setTimeout(() => setGenerationStep(3), 3000); // Deploying AI Agents
    setTimeout(() => {
        setWebsiteUrl(`https://${vendor.slug}.snehalata.com`);
        setIsGenerating(false);
    }, 4500);
  };

  if (!vendor) return <div className="p-10 text-center text-aura-purple animate-pulse">Vendor Console চালু হচ্ছে...</div>;

  return (
    <div className="min-h-screen bg-black pb-20">
      {/* Header Stats */}
      <div className="bg-aura-darkPurple/20 border-b border-aura-glassBorder relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-serif font-bold text-white">{vendor.name}</h1>
                {vendor.status === 'APPROVED' ? (
                  <span className="bg-green-500/10 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                    <ShieldCheck size={14} /> Aura ভেরিফাইড
                  </span>
                ) : (
                  <span className="bg-red-500/10 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                    <AlertTriangle size={14} /> রিভিউ প্রয়োজন
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-sm max-w-xl">{vendor.description}</p>
            </div>
            
            <div className="flex gap-4">
               {vendor.websiteUrl && (
                 <a href={vendor.websiteUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-widest">
                   <Globe size={16} /> আমার ওয়েবসাইট
                 </a>
               )}
               <button 
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-700 to-indigo-700 rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-purple-900/40 hover:scale-105 transition-transform border border-white/10"
               >
                 {isFormOpen ? <X size={18} /> : <Plus size={18} />}
                 {isFormOpen ? 'Cancel' : 'পণ্য যোগ করুন'}
               </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* 1-Click Website Generator Section */}
        <div className="mb-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-gradient-to-br from-indigo-900/40 to-purple-900/20 border border-aura-glassBorder rounded-3xl p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-32 bg-purple-500/10 blur-[80px] rounded-full group-hover:bg-purple-500/20 transition-all"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <Rocket className="text-purple-400" />
                        <h2 className="text-2xl font-serif font-bold text-white">1-Click AI Store Generator</h2>
                    </div>
                    <p className="text-gray-300 mb-8 max-w-lg">
                        আপনার ব্র্যান্ডের জন্য একটি সম্পূর্ণ ই-কমার্স ওয়েবসাইট তৈরি করুন এক ক্লিকে। ফ্রি সাবডোমেইন, হোস্টিং এবং AI অটোমেশন সহ।
                    </p>
                    
                    {!websiteUrl && !isGenerating && (
                        <button 
                            onClick={handleGenerateWebsite}
                            className="bg-white text-black px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors shadow-lg shadow-white/10 flex items-center gap-2"
                        >
                            <Zap size={18} className="text-purple-600" /> জেনারেট করুন
                        </button>
                    )}

                    {isGenerating && (
                        <div className="space-y-4">
                            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 animate-[loading_2s_ease-in-out_infinite]" style={{width: `${generationStep * 33}%`}}></div>
                            </div>
                            <p className="text-purple-300 font-mono text-xs uppercase tracking-widest animate-pulse">
                                {generationStep === 1 && "Allocating Subdomain..."}
                                {generationStep === 2 && "Deploying AI Agents..."}
                                {generationStep === 3 && "Optimizing SEO & CDN..."}
                            </p>
                        </div>
                    )}

                    {websiteUrl && (
                        <div className="bg-green-500/10 border border-green-500/30 p-6 rounded-2xl animate-in zoom-in duration-300">
                             <div className="flex items-center gap-3 mb-2">
                                <CheckCircle2 className="text-green-400" />
                                <h3 className="font-bold text-green-400">Website Live!</h3>
                             </div>
                             <a href="#" className="text-xl text-white underline decoration-purple-500 underline-offset-4 font-mono">{websiteUrl}</a>
                             <p className="text-xs text-gray-400 mt-2">আপনার ড্যাশবোর্ড থেকে এখন এটি ম্যানেজ করা যাবে।</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Free Features List */}
            <div className="bg-aura-glass border border-aura-glassBorder rounded-3xl p-8">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Bot size={20} className="text-aura-purple" />
                    Free Ecosystem Features
                </h3>
                <ul className="space-y-4">
                    {[
                        "অটোমেটেড সাবডোমেইন (yourbrand.snehalata.com)",
                        "AI ইনভেন্টরি ম্যানেজমেন্ট",
                        "Virtual Try-On ইন্টিগ্রেশন",
                        "সোশ্যাল মিডিয়া অটো-পোস্টিং",
                        "জিরো কমিশন (Beta Period)"
                    ].map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-gray-400 text-sm">
                            <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
                                <CheckCircle2 size={12} className="text-purple-400" />
                            </div>
                            {feature}
                        </li>
                    ))}
                </ul>

                {/* AI Automation Toggles */}
                <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-300">AI Auto-Reply</span>
                        <div className="w-10 h-5 bg-purple-600 rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-300">Price Optimization</span>
                        <div className="w-10 h-5 bg-white/10 rounded-full relative cursor-pointer">
                            <div className="absolute left-1 top-1 w-3 h-3 bg-gray-400 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Add Product Form */}
        {isFormOpen && (
          <div className="mb-12 bg-white/5 border border-white/10 p-8 rounded-3xl animate-in fade-in slide-in-from-top-4 backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-6 border-b border-white/10 pb-4 font-serif">নতুন ইনভেন্টরি এন্ট্রি</h2>
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">পণ্যের নাম</label>
                <input 
                  required
                  value={newProduct.name}
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                  placeholder="e.g. Royal Muslin Panjabi"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">মূল্য (BDT)</label>
                <input 
                  required
                  type="number"
                  value={newProduct.price}
                  onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                  placeholder="5000"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">ক্যাটাগরি</label>
                <input 
                  required
                  value={newProduct.category}
                  onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                  placeholder="e.g. Saree, Panjabi"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">এক্সটার্নাল ওয়েবসাইট লিংক (Optional)</label>
                <input 
                  type="url"
                  value={newProduct.externalUrl}
                  onChange={e => setNewProduct({...newProduct, externalUrl: e.target.value})}
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                  placeholder="https://yourstore.com/product"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">বিবরণ</label>
                <textarea 
                  required
                  value={newProduct.description}
                  onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors h-32 text-sm"
                  placeholder="Describe the material, craft, and heritage..."
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button type="submit" className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">
                  <Save size={18} /> আইটেম প্রকাশ করুন
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Product Grid */}
        <div>
          <h2 className="text-xl font-serif font-bold text-white mb-6 flex items-center gap-4">
            বর্তমান ইনভেন্টরি
            <span className="text-xs font-sans font-normal text-gray-500 bg-white/5 px-2 py-1 rounded-md">{products.length} টি আইটেম</span>
          </h2>
          
          {products.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl text-gray-500">
              এখনও কোন পণ্য তালিকাভুক্ত করা হয়নি।
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map(product => (
                <ProductCard key={product.id} product={product} vendor={vendor} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};