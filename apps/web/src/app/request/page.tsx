'use client';

import { useState } from 'react';
import { Smartphone, CheckCircle } from 'lucide-react';

export default function RequestBoardPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('loading');
        
        const formData = new FormData(e.currentTarget);
        const input = {
            deviceType: formData.get('deviceType'),
            brand: formData.get('brand'),
            model: formData.get('model'),
            storagePreference: formData.get('storagePreference'),
            colorPreference: formData.get('colorPreference'),
            conditionPreference: formData.get('conditionPreference'),
            budgetMax: parseInt(formData.get('budgetMax') as string, 10),
            additionalNotes: formData.get('additionalNotes'),
            customerId: 'guest', // In Phase 2, this will be the logged-in user's ID
        };

        const query = `
            mutation SubmitRequest($input: SubmitGadgetRequestInput!) {
                submitGadgetRequest(input: $input) {
                    id
                    status
                }
            }
        `;

        try {
            const res = await fetch(process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/shop-api', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, variables: { input } })
            });
            const data = await res.json();
            
            if (data.errors) throw new Error('GraphQL Error');
            setStatus('success');
        } catch (error) {
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
                <div className="bg-emerald-50 text-emerald-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={48} />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-4">Request Received!</h1>
                <p className="text-slate-600 mb-8">Our team in Canada will start sourcing your device immediately. We will contact you shortly with a price quote.</p>
                <button onClick={() => setStatus('idle')} className="text-emerald-600 font-semibold hover:underline">Submit another request</button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Can't find what you want?</h1>
                <p className="text-lg text-slate-600">Tell us exactly what you're looking for, and our agents in Canada will source it for you.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Device Type</label>
                        <select name="deviceType" required className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none">
                            <option value="Phone">Smartphone</option>
                            <option value="Tablet">Tablet</option>
                            <option value="Laptop">Laptop</option>
                            <option value="Watch">Smartwatch</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Brand</label>
                        <input type="text" name="brand" placeholder="e.g. Apple, Samsung" required className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Specific Model</label>
                        <input type="text" name="model" placeholder="e.g. iPhone 13 Pro Max" required className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Storage Preference</label>
                        <select name="storagePreference" className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none">
                            <option value="Any">Any</option>
                            <option value="64GB">64GB</option>
                            <option value="128GB">128GB</option>
                            <option value="256GB">256GB</option>
                            <option value="512GB">512GB</option>
                            <option value="1TB">1TB+</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Color Preference</label>
                        <input type="text" name="colorPreference" placeholder="e.g. Space Gray or Any" className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Minimum Condition</label>
                        <select name="conditionPreference" className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none">
                            <option value="Excellent">Excellent (Like New)</option>
                            <option value="Good">Good (Minor scratches)</option>
                            <option value="Fair">Fair (Visible wear)</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Maximum Budget (₦)</label>
                    <input type="number" name="budgetMax" placeholder="e.g. 500000" required className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Additional Notes</label>
                    <textarea name="additionalNotes" rows={3} placeholder="Any other requirements like battery health..." className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none"></textarea>
                </div>

                {status === 'error' && <p className="text-red-500 text-sm">An error occurred. Please try again.</p>}

                <button type="submit" disabled={status === 'loading'} className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-70">
                    {status === 'loading' ? 'Submitting...' : 'Submit Request'}
                </button>
            </form>
        </div>
    );
}
