import { useState, useEffect } from 'react';
import VQMlogo from './VQM-logo.png';
import VQMLogo2 from './vqm-logo-2.png';
import VQMLogo3 from './vqm-logo-3.png';
import VQMAvatar from './vqm-avatar-1.png';
import VQMAvatar2 from './vqm-avatar-2.png';
import VQMAvatar3 from './vqm-avatar-3.png';
import './vqm-footer.css'
import { SiGmail, SiLinkedin, SiGithub } from 'react-icons/si';

const logoList = [
  VQMlogo,
  VQMAvatar2,
  VQMLogo3,
  VQMAvatar,
  VQMLogo2,
  VQMAvatar3
];

const VqmFooter = () => {
  const [logoIdx, setLogoIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setLogoIdx(idx => (idx + 1) % logoList.length);
        setFade(true);
      }, 350); // fade out duration
    }, 3200); // total duration per logo
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="footer">
      <a href="https://revoloero.github.io">
        <img
          src={logoList[logoIdx]}
          alt="vqm-logo"
          className={`footer-logo${fade ? ' fade-in' : ' fade-out'}`}
        />
      </a>
      <div className="brand">&copy;2025 Vuong Quyen Mai</div>
      <div className="social-links">
        <a href="mailto:vuongquyenmai@gmail.com" aria-label="Gmail" target="_blank" rel="noopener noreferrer"><SiGmail /></a>
        <a href="https://www.linkedin.com/in/vuong-quyen-mai/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><SiLinkedin /></a>
        <a href="https://github.com/RevoloerO" aria-label="GitHub" target="_blank" rel="noopener noreferrer"><SiGithub /></a>
      </div>
    </div>
  );
};

export default VqmFooter;
