import React from 'react';
import { MapPin, Mail, Phone, ShieldCheck } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-stone-950 text-stone-200 min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* About Section */}
        <section className="text-center space-y-6">
          <h1 className="text-5xl font-serif text-white">Our Story</h1>
          <p className="text-lg leading-relaxed text-stone-400">
            Born in the heart of Mahabaleshwar, Wefpro is dedicated to preserving the natural 
            essence of fruits. Our jams are handcrafted in small batches using 74% real fruit 
            and zero artificial colors. We believe in the "Farm to Jar" philosophy.
          </p>
        </section>

        {/* Licence/Trust Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-stone-900 p-8 rounded-2xl border border-stone-800 flex items-center gap-4">
            <ShieldCheck className="text-green-500" size={40} />
            <div>
              <h3 className="text-white font-bold">FSSAI Certified</h3>
              <p className="text-sm text-stone-400">License No: 221525039001364</p>
            </div>
          </div>
          <div className="bg-stone-900 p-8 rounded-2xl border border-stone-800 flex items-center gap-4">
            <MapPin className="text-red-500" size={40} />
            <div>
              <h3 className="text-white font-bold">Origin</h3>
              <p className="text-sm text-stone-400">Panchgani-Mahabaleshwar, Maharashtra</p>
            </div>
          </div>
        </div>

        {/* Contact Form Placeholder */}
        <section className="bg-white text-black p-10 rounded-3xl">
          <h2 className="text-3xl font-serif mb-6 text-center">Get in Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3"><Mail size={20}/>cswefpro@gmail.com</div>
              <div className="flex items-center gap-3"><Phone size={20}/> +919405836623</div>
            </div>
            <div className="space-y-4">
               <p className="text-sm">For bulk orders or distribution inquiries, please reach out via email.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
export default About;