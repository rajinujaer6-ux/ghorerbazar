import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  Truck,
  RotateCcw,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface StaticPageProps {
  onNavigate: (view: string, param?: string) => void;
}

export const AboutPage: React.FC<StaticPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C] bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
          Our Heritage & Promise
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans']">
          About Ghorer Bazar (ঘরের বাজার)
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto font-['Hind_Siliguri'] leading-relaxed">
          নিরাপদ ও খাঁটি খাদ্য দিয়ে সুস্থ পারিবারিক জীবন নিশ্চিত করার দৃঢ় প্রত্যয় নিয়ে আমাদের যাত্রা।
        </p>
      </div>

      <div className="relative rounded-3xl overflow-hidden aspect-video max-h-80 shadow-lg">
        <img
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200"
          alt="Organic Farming and Harvest"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-6 sm:p-8">
          <p className="text-white text-sm sm:text-base font-medium max-w-xl">
            "We believe that real, unadulterated nourishment is not a luxury — it is a basic human right for every family in Bangladesh."
          </p>
        </div>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <h2 className="text-xl font-bold text-slate-900">The Story of Ghorer Bazar</h2>
        <p>
          Established with the singular vision of eradicating food adulteration from Bangladeshi households, Ghorer Bazar has grown into a household name trusted by over 100,000+ conscious families nationwide.
        </p>
        <p>
          Unlike conventional supermarkets that rely on mass wholesale middlemen and industrial chemical preservatives, our teams go directly to the grassroots. We venture deep into the Sundarban mangrove forests alongside generational *Mawals* (honey hunters) to harvest raw floral nectar. We operate traditional cold-press wooden *Ghanis* to crush high-grade mustard seeds at ambient temperatures, preserving their natural pungency, vitamins, and antioxidants.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <Award className="w-6 h-6 text-[#EA580C] mb-2" />
            <h4 className="font-bold text-slate-900 text-sm">Certified Pure</h4>
            <p className="text-xs text-slate-500 mt-1">
              Every batch undergoes rigorous quality checks and BSTI-aligned purity testing.
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <ShieldCheck className="w-6 h-6 text-[#EA580C] mb-2" />
            <h4 className="font-bold text-slate-900 text-sm">Zero Adulteration</h4>
            <p className="text-xs text-slate-500 mt-1">
              Zero added sugars, no artificial fragrances, zero chemical dyes, and zero preservatives.
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <Truck className="w-6 h-6 text-[#EA580C] mb-2" />
            <h4 className="font-bold text-slate-900 text-sm">Direct to Doorstep</h4>
            <p className="text-xs text-slate-500 mt-1">
              Delivering inside Dhaka within 24 hours and all 64 districts in 48 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FaqPage: React.FC<StaticPageProps> = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Does pure raw honey freeze or crystallize in winter?',
      a: 'Yes, absolutely! Natural raw honey contains high proportions of natural glucose, pollen grains, and enzymes. In colder weather, natural crystallization is actually a scientific proof of raw, unheated honey. Heated or sugar-syrup mixed adulterated honeys rarely crystallize.',
    },
    {
      q: 'How is your wood-pressed mustard oil different from regular mill oil?',
      a: 'Industrial metal expellers generate intense frictional heat (over 80°C), which destroys natural antioxidants and beneficial allyl isothiocyanate. Our heritage wooden ghani operates slowly at ambient temperatures, preserving the intense natural pungency, golden color, and heart-healthy fatty acids.',
    },
    {
      q: 'Can I check the parcel before paying for Cash on Delivery?',
      a: 'Yes! We encourage every customer to open and verify the parcel in front of the delivery rider before handing over payment. If there is any breakage or discrepancy, you can return it on the spot without penalty.',
    },
    {
      q: 'What is the delivery timeline and charge?',
      a: 'Inside Dhaka city, delivery is completed within 24 hours (charge ৳70). Outside Dhaka across all 64 districts, delivery takes 48 to 72 hours via courier (charge ৳130). Orders over ৳2,000 enjoy 100% FREE delivery!',
    },
    {
      q: 'Where do you source your Saudi dates from?',
      a: 'We import Grade-A fresh seasonal Ajwa from Al-Madinah Al-Munawwarah, and Medjool and Sukkari dates from certified organic orchards, hygienically packed in food-grade airtight containers.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C] bg-orange-50 px-3 py-1 rounded-full">
          Help & Support
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Frequently Asked Questions (FAQs)
        </h1>
        <p className="text-xs text-slate-500">
          Answers to common questions about our pure food sourcing, delivery, and testing.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-800 hover:text-[#EA580C] transition-colors cursor-pointer"
            >
              <span>{faq.q}</span>
              <ChevronDown
                className={`w-4 h-4 shrink-0 transition-transform ${
                  openIndex === i ? 'rotate-180 text-[#EA580C]' : 'text-slate-400'
                }`}
              />
            </button>
            {openIndex === i && (
              <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const ContactPage: React.FC<StaticPageProps> = () => {
  const { settings, addToast } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('success', 'Message Sent', 'Thank you! Our support team will reach you soon.');
    setName('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Contact Ghorer Bazar Customer Care
        </h1>
        <p className="text-xs text-slate-500">
          We are here to assist with any questions, orders, or feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Contact Info (5 Cols) */}
        <div className="md:col-span-5 bg-[#053229] text-white p-6 sm:p-8 rounded-3xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-amber-300">Direct Customer Hotline</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Call us any day between 9:00 AM to 10:00 PM for instant order placement or tracking.
            </p>

            <div className="space-y-4 pt-2 text-xs">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#EA580C]" />
                <div>
                  <p className="text-slate-400 text-[10px]">Hotline</p>
                  <p className="font-bold text-sm text-white">{settings.contactPhone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-[#25D366]" />
                <div>
                  <p className="text-slate-400 text-[10px]">WhatsApp Support</p>
                  <p className="font-bold text-sm text-white">{settings.whatsappNumber}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#EA580C]" />
                <div>
                  <p className="text-slate-400 text-[10px]">Email Support</p>
                  <p className="font-bold text-white">{settings.contactEmail}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#EA580C] shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-400 text-[10px]">Central Organic Hub</p>
                  <p className="text-slate-200">{settings.address}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-emerald-900 text-xs text-emerald-200">
            🌿 100% satisfaction and genuine food promise.
          </div>
        </div>

        {/* Form (7 Cols) */}
        <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-slate-900">Send Us an Inquiry</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tanvir Ahmed"
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Message *</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we assist you with our natural products or delivery?"
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export const PrivacyPage: React.FC<StaticPageProps> = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
        Privacy & Customer Protection Policy
      </h1>
      <p>
        At Ghorer Bazar, we respect your confidentiality and ensure that your personal information, mobile contact numbers, and delivery addresses are kept strictly safe and never disclosed to unauthorized third-party commercial marketing entities.
      </p>
      <h3 className="text-base font-bold text-slate-900 pt-2">Data Collection & Usage</h3>
      <p>
        We collect only the essential details necessary to fulfill your doorstep delivery and provide live SMS tracking through our licensed courier delivery partners.
      </p>
    </div>
  );
};

export const TermsPage: React.FC<StaticPageProps> = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
        Terms of Service & Delivery Conditions
      </h1>
      <p>
        Welcome to Ghorer Bazar. By placing an order via our website, hotline, or WhatsApp service, you agree to our standard terms of purchase and quality standards.
      </p>
      <h3 className="text-base font-bold text-slate-900 pt-2">Inspection & Return Policy</h3>
      <p>
        Every buyer has the full right to open and inspect the contents of their package upon arrival. If an item arrives compromised or damaged, you can refuse acceptance on the spot without paying delivery fees.
      </p>
    </div>
  );
};
