import { FaFacebookF, FaYoutube, FaTiktok } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="w-full bg-[var(--color-bg-primary)] border-t border-black/10 py-5 px-6 relative z-10 mt-auto">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 px-4 md:px-12">
        
        {/* 1. KHỐI BRAND (LOGO & SLOGAN) */}
        <div className="flex items-center justify-center lg:justify-start gap-4 min-w-[250px]">
          <img src="/images/logo.png" alt="Logo" className="w-12 h-14 object-cover shrink-0" />
          <div className="text-center lg:text-left">
            <h3 className="font-display font-black text-base uppercase text-black tracking-tighter md:text-left text-left">Lạy Online</h3>
            <p className="text-[10px] text-gray-500 font-bold pt-0.5 leading-tight md:text-left text-left">
              Lạy là có phúc, <br className="lg:hidden" /> không lạy cũng... có phúc!
            </p>
          </div>
        </div>

        {/* 2. KHỐI COPYRIGHT (Nằm giữa ở PC, nằm dưới ở Tablet) */}
        <div className="order-3 lg:order-2 text-[11px] font-black text-gray-400 text-center uppercase tracking-widest">
          &copy; 2024 Lạy Online. All rights reserved.
        </div>

        {/* 3. KHỐI LINKS & SOCIALS */}
        <div className="order-2 lg:order-3 flex flex-col md:flex-row items-center gap-6">
          {/* Các liên kết chính sách */}
          <div className="flex items-center gap-4 text-[11px] font-black text-gray-500 uppercase tracking-tighter">
            <a href="#" className="hover:text-orange-600 transition-colors">Điều khoản</a>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <a href="#" className="hover:text-orange-600 transition-colors">Bảo mật</a>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <a href="#" className="hover:text-black transition-colors">Liên hệ</a>
          </div>

          {/* Icon mạng xã hội */}
          <div className="flex gap-2.5">
            {[
              { icon: <FaFacebookF size={14} />, color: "bg-[#1877F2]", title: "Facebook" },
              { icon: <FaTiktok size={14} />, color: "bg-black", title: "TikTok" },
              { icon: <FaYoutube size={16} />, color: "bg-[#FF0000]", title: "YouTube" }
            ].map((soc, idx) => (
              <a
                key={idx}
                href="#"
                className={`w-8 h-8 ${soc.color} text-white rounded-full flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all shadow-sm`}
                title={soc.title}
              >
                {soc.icon}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}