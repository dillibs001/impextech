'use client';

import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';

export function WhatsAppButton() {
  const whatsappUrl = "https://wa.me/2349060329221?text=Hello%20impextech,%20I'm%20inquiring%20about%20a%20device.";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 left-6 z-50 bg-[#25D366] hover:bg-[#20ba59] text-white p-3.5 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2 font-medium text-sm group"
    >
      <WhatsAppIcon className="w-6 h-6 fill-white" />
      <span className="hidden sm:inline-block pr-1 font-semibold">WhatsApp Us</span>
    </a>
  );
}
