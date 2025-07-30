'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFacebook, 
  faTwitter, 
  faInstagram, 
  faYoutube 
} from '@fortawesome/free-brands-svg-icons';
import { useLanguage } from '@/contexts/LanguageContext';
import './Footer.css';

export default function Footer() {
  const { t, language } = useLanguage();

  return (
    <footer dir={language === 'ar' ? 'rtl' : 'ltr'} className="footer">
      <div className="footer-content">
        {/* القسم العلوي */}
        <div className="footer-main">
          <div className="footer-columns">
            {/* معلومات عنا */}
            <div className="footer-column">
              <h3 className="footer-title">{t('aboutUs')}</h3>
              <p className="footer-description">
                {t('aboutUsDescription')}
              </p>
                             <div className="social-media">
                 <a href="#" className="social-icon youtube">
                   <FontAwesomeIcon icon={faYoutube} />
                 </a>
                 <a href="#" className="social-icon instagram">
                   <FontAwesomeIcon icon={faInstagram} />
                 </a>
                 <a href="#" className="social-icon twitter">
                   <FontAwesomeIcon icon={faTwitter} />
                 </a>
                 <a href="#" className="social-icon facebook">
                   <FontAwesomeIcon icon={faFacebook} />
                 </a>
               </div>
            </div>

            {/* فروعنا */}
            <div className="footer-column">
              <h3 className="footer-title">{t('ourBranches')}</h3>
              <a href="#" className="branches-link">
                {t('viewBranchesLink')}
              </a>
            </div>

            {/* طرق الدفع */}
            <div className="footer-column">
              <h3 className="footer-title">{t('paymentMethods')}</h3>
                             <div className="payment-methods">
                 <div className="payment-logo">
                   <img src="/images/mastercard.png" alt="Mastercard" />
                 </div>
                 <div className="payment-logo">
                   <img src="/images/visa.png" alt="VISA" />
                 </div>
                 <div className="payment-logo">
                   <img src="/images/vodafone.jfif" alt="Vodafone Cash" />
                 </div>
                 <div className="payment-logo">
                   <img src="/images/instapay.png" alt="Instapay" />
                 </div>
               </div>
            </div>

            {/* تواصل معنا */}
            <div className="footer-column">
              <h3 className="footer-title">{t('contactUs')}</h3>
              <div className="contact-info">
                <div className="contact-item">
                  <span className="contact-icon">📞</span>
                  <span>01234567890</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">✉️</span>
                  <span>info@restaurant.com</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">🕒</span>
                  <span>{t('workingHours')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* القسم السفلي */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="footer-copyright">
              <span className="copyright-text">© 2025 EPI-SYS.</span>
              <div className="epi-logo">
                <div className="logo-lines">
                  <div className="logo-line"></div>
                  <div className="logo-line"></div>
                  <div className="logo-line"></div>
                </div>
              </div>
              <span className="rights-reserved">{t('allRightsReserved')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 