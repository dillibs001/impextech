import Link from 'next/link';
import { ShieldCheck, BatteryCharging, CheckCircle2, Award, ArrowRight, HeartHandshake, MapPin } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl">
            {/* Header */}
            <div className="max-w-2xl mb-12">
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-red-600 bg-red-50 border border-red-100 px-3 py-1 rounded-full mb-3">
                    <Award className="w-3.5 h-3.5" /> Direct Canada Sourcing
                </span>
                <h1 className="text-3xl sm:text-5xl font-black text-[#1E2127] tracking-tight leading-tight mb-4">
                    Quality tech without breaking the bank.
                </h1>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    impextech was founded to eliminate the gamble in buying pre-owned and refurbished electronics in Nigeria. Every unit we sell is hand-inspected in Canada, tested across 50+ hardware checkpoints, and backed by a 7-day money-back guarantee.
                </p>
            </div>

            {/* Core Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-5">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-[#1E2127] mb-2">Direct Canadian Sourcing</h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            We don't buy locally repaired or altered devices in Computer Village. All inventory is sourced directly from certified Canadian retail trade-in partners in Toronto and Vancouver.
                        </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-red-600">
                        100% Genuine OEM Components
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                            <BatteryCharging className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-[#1E2127] mb-2">Documented Battery Health</h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            No fake 100% battery boost hacks. We test actual charge cycles and health via hardware diagnostic benches, guaranteeing minimum 85%+ capacity on every single unit.
                        </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-emerald-700">
                        True Capacity Guarantee
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="w-12 h-12 rounded-2xl bg-[#2B2E35] text-white flex items-center justify-center mb-5">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-[#1E2127] mb-2">7-Day Money-Back Guarantee</h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            Confidence you can count on. Take your gadget, run your everyday apps, check the battery, test the cameras. If any hardware defect occurs within 7 days, get a swap or full refund.
                        </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-slate-700">
                        Zero Risk Shopping
                    </div>
                </div>
            </div>

            {/* Sourcing & Verification Walkthrough */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 mb-16 shadow-sm">
                <div className="max-w-xl mb-8">
                    <span className="text-xs font-black text-red-600 uppercase tracking-wider block mb-1">Our Process</span>
                    <h2 className="text-2xl sm:text-3xl font-black text-[#1E2127] tracking-tight">How each gadget reaches your hands</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs text-slate-600">
                    <div className="border-l-2 border-red-600 pl-4">
                        <strong className="text-sm text-[#1E2127] block mb-1">1. Sourcing in Canada</strong>
                        Selected from enterprise off-lease and verified trade-in programs across Ontario and British Columbia.
                    </div>
                    <div className="border-l-2 border-[#2B2E35] pl-4">
                        <strong className="text-sm text-[#1E2127] block mb-1">2. 50-Point Bench Test</strong>
                        Every sensor, speaker, port, display zone, and camera is evaluated against original factory specs.
                    </div>
                    <div className="border-l-2 border-emerald-600 pl-4">
                        <strong className="text-sm text-[#1E2127] block mb-1">3. Clean IMEI Validation</strong>
                        Verified against global GSMA databases to guarantee 100% factory unlocked status for all Nigerian networks.
                    </div>
                    <div className="border-l-2 border-slate-400 pl-4">
                        <strong className="text-sm text-[#1E2127] block mb-1">4. Insured Delivery</strong>
                        Packed with protective shock padding and delivered with full transit insurance across all 36 states.
                    </div>
                </div>
            </div>

            {/* Contact CTA */}
            <div className="bg-gradient-to-br from-[#24272E] via-[#2B2E36] to-[#1E2127] text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-[#3E4452] shadow-xl">
                <div>
                    <h3 className="text-2xl font-black mb-2">Speak directly with our team</h3>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-md">
                        Have a question about a specific device or want a live video inspection? Reach out to our concierge team directly.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <a
                        href="https://wa.me/2349060329221"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-bold px-6 py-3.5 rounded-full transition-all flex items-center gap-2 shadow-sm"
                    >
                        <WhatsAppIcon className="w-4 h-4 fill-current" /> WhatsApp: +234 906 032 9221
                    </a>
                    <Link
                        href="/products"
                        className="bg-white hover:bg-slate-100 text-[#1E2127] text-xs sm:text-sm font-bold px-6 py-3.5 rounded-full transition-colors"
                    >
                        Browse Inventory
                    </Link>
                </div>
            </div>
        </div>
    );
}
