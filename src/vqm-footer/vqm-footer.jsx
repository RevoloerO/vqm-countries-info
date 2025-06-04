import VQMlogo from './VQM-logo.png';
import './vqm-footer.css'

const VqmFooter = () => {
  return (
    <div className="footer">
      <a href="https://revoloero.github.io"><img src={VQMlogo} alt="vqm-logo"/></a>
      <div className="brand">&copy;2023 Vuong Quyen Mai</div>
      <div className="social-links">
        {/* Add social icons/links here if needed */}
      </div>
    </div>
  );
};

export default VqmFooter;
