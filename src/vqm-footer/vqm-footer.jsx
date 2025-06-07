import VQMlogo from './VQM-logo.png';
import './vqm-footer.css'
import { SiGmail, SiLinkedin, SiGithub } from 'react-icons/si';

const VqmFooter = () => {
  return (
    <div className="footer">
      <a href="https://revoloero.github.io"><img src={VQMlogo} alt="vqm-logo"/></a>
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
