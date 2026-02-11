import React from 'react';
import { 
    FacebookImgIcon, InstagramImgIcon, ThreadsImgIcon, 
    TiktokImgIcon, LinkedinImgIcon, MailImgIcon 
} from './icons';
import { View } from '../types';

interface FooterProps {
    onNavigate: (page: View) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNavClick = (e: React.MouseEvent, page: View) => {
    e.preventDefault();
    onNavigate(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-[#262626] text-white">
     <footer className="p-8 md:p-12">
      <div className="flex justify-between flex-wrap max-w-7xl mx-auto gap-8">
        {/* About Section */}
        <div className="flex-1 min-w-[160px]">
          <h4 className="text-white mb-6 font-oswald font-bold uppercase text-xl tracking-widest">ABOUT</h4>
          <ul className="list-none p-0 m-0 text-sm text-[#d4d4d4] space-y-3 font-sans">
            <li>
                <button onClick={(e) => handleNavClick(e, 'services')} className="hover:text-white transition-colors font-bold uppercase text-left w-full tracking-wider">WHAT WE DO</button>
            </li>
            <li>
                <button onClick={(e) => handleNavClick(e, 'how-we-work')} className="hover:text-white transition-colors font-bold uppercase text-left w-full tracking-wider">HOW WE WORK</button>
            </li>
            <li>
                <button onClick={(e) => handleNavClick(e, 'about')} className="hover:text-white transition-colors font-bold uppercase text-left w-full tracking-wider">WHO WE ARE</button>
            </li>
            <li>
                <button onClick={(e) => handleNavClick(e, 'community')} className="hover:text-white transition-colors font-bold uppercase text-left w-full tracking-wider">COMMUNITY</button>
            </li>
            <li>
                <button onClick={(e) => handleNavClick(e, 'contact')} className="hover:text-white transition-colors font-bold uppercase text-left w-full tracking-wider">LOCATION</button>
            </li>
          </ul>
        </div>

        {/* Services Section */}
        <div className="flex-1 min-w-[160px]">
          <h4 className="text-white mb-6 font-oswald font-bold uppercase text-xl tracking-widest">SERVICES</h4>
          <ul className="list-none p-0 m-0 text-sm text-[#d4d4d4] space-y-3 font-sans">
            <li>
                <button onClick={(e) => handleNavClick(e, 'faq')} className="hover:text-white transition-colors font-bold uppercase text-left w-full tracking-wider">FAQS</button>
            </li>
            <li>
                <button onClick={(e) => handleNavClick(e, 'terms-of-service')} className="hover:text-white transition-colors font-bold uppercase text-left w-full tracking-wider">TERMS OF SERVICE</button>
            </li>
            <li>
                <button onClick={(e) => handleNavClick(e, 'return-policy')} className="hover:text-white transition-colors font-bold uppercase text-left w-full tracking-wider">RETURN AND EXCHANGE POLICY</button>
            </li>
            <li>
                <button onClick={(e) => handleNavClick(e, 'privacy-policy')} className="hover:text-white transition-colors font-bold uppercase text-left w-full tracking-wider">PRIVACY POLICY</button>
            </li>
            {/* Hidden Admin Access - Preserved for functionality */}
            <li className="h-4 opacity-0">
                <button onClick={(e) => handleNavClick(e, 'admin')} className="w-full h-full cursor-default">Admin</button>
            </li>
          </ul>
        </div>

        {/* Connect Section */}
        <div className="flex-1 min-w-[160px]">
          <h4 className="text-white mb-6 font-oswald font-bold uppercase text-xl tracking-widest">CONNECT</h4>
          <div className="flex gap-5 my-2.5">
            <a href="https://www.facebook.com/statsph" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-[#d4d4d4] hover:text-white transition-all transform hover:scale-110">
              <FacebookImgIcon className="w-6 h-6 grayscale hover:grayscale-0" />
            </a>
            <a href="https://www.instagram.com/statsph/" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="text-[#d4d4d4] hover:text-white transition-all transform hover:scale-110">
              <InstagramImgIcon className="w-6 h-6 grayscale hover:grayscale-0" />
            </a>
            <a href="https://www.threads.net/@statsph?igshid=NTc4MTIwNjQ2YQ==" target="_blank" rel="noopener noreferrer" aria-label="Threads" className="text-[#d4d4d4] hover:text-white transition-all transform hover:scale-110">
               <ThreadsImgIcon className="w-6 h-6 grayscale hover:grayscale-0" />
            </a>
            <a href="https://www.tiktok.com/@statsph?_t=8s5OXGDiNX8&_r=1" aria-label="Tiktok" target="_blank" rel="noopener noreferrer" className="text-[#d4d4d4] hover:text-white transition-all transform hover:scale-110">
              <TiktokImgIcon className="w-6 h-6 grayscale hover:grayscale-0" />
            </a>
            <a href="https://www.linkedin.com/company/stats-technical-apparel" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" className="text-[#d4d4d4] hover:text-white transition-all transform hover:scale-110">
              <LinkedinImgIcon className="w-6 h-6 grayscale hover:grayscale-0" />
            </a>
            <a href="mailto:statsfxl@gmail.com" aria-label="Email" target="_blank" rel="noopener noreferrer" className="text-[#d4d4d4] hover:text-white transition-all transform hover:scale-110">
              <MailImgIcon className="w-6 h-6 grayscale hover:grayscale-0" />
            </a>
          </div>
        </div>
      </div>
      </footer>
    <div className="bg-[#111111] text-center py-4 font-sans text-[#777777] text-xs border-t border-[#333333]">
        <p>
        Copyright &copy; 2026 - <b className="text-[#d4d4d4]">STATSPH</b>
        </p>
    </div>
  </div>
  );
};

export default Footer;
