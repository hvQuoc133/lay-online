import { FaFacebookF, FaYoutube, FaTiktok } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="w-full bg-[var(--color-bg-primary)] border-t border-black/10 py-2 px-6 relative z-10 mt-auto">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-6 md:px-12">
        <div className="flex items-center justify-center gap-3 mb-4 md:mb-0">
          <img src="/images/logo.png" alt="Logo" className="w-13 h-15 object-cover" />
          <div>
            <h3 className="font-display font-bold text-sm uppercase text-black">Lạy Online</h3>
            <p className="text-[10px] text-gray-500 font-medium pt-1">Lạy là có phúc, không lạy cũng... có phúc!</p>
          </div>
        </div>

        <div className="text-xs font-bold text-gray-400 text-center">
          &copy; 2024 Lạy Online. All rights reserved.
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-xs font-bold text-gray-500">
          <a href="#" className="hover:text-black transition-colors">Điều khoản sử dụng</a>
          <a href="#" className="hover:text-black transition-colors">Chính sách bảo mật</a>
          <a href="#" className="hover:text-black transition-colors">Liên hệ</a>

          <div className="flex gap-2 ml-4">
            <a
              href="#"
              className="w-8 h-8 bg-[#1877F2] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
              title="Facebook"
            >
              <FaFacebookF size={14} />
            </a>

            <a
              href="#"
              className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
              title="TikTok"
            >
              <FaTiktok size={14} />
            </a>

            <a
              href="#"
              className="w-8 h-8 bg-[#FF0000] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
              title="YouTube"
            >
              <FaYoutube size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
