const Footer = () => (
  <footer className="bg-black text-stone-500 py-12 px-6 border-t border-stone-900">
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
      <div>
        <h4 className="text-white font-serif text-xl mb-4">WEFPRO</h4>
        <p className="text-sm">FSSAI License: 215XXXXXXXXXXX</p>
        <p className="text-sm mt-2">Panchgani-Mahabaleshwar, Maharashtra</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h5 className="text-white text-xs font-bold uppercase">Legal</h5>
          <a href="/privacy" className="block text-xs hover:text-red-500">Privacy Policy</a>
          <a href="/terms" className="block text-xs hover:text-red-500">Terms of Service</a>
        </div>
        <div className="space-y-2">
          <h5 className="text-white text-xs font-bold uppercase">Support</h5>
          <a href="/shipping" className="block text-xs hover:text-red-500">Shipping Policy</a>
          <a href="/contact" className="block text-xs hover:text-red-500">Contact Us</a>
        </div>
      </div>
      <div className="text-sm">
        <h5 className="text-white text-xs font-bold uppercase mb-4">Newsletter</h5>
        <input type="email" placeholder="Email" className="bg-stone-900 p-2 rounded w-full border border-stone-800" />
      </div>
    </div>
  </footer>
);