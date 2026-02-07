import { GiWorld } from 'react-icons/gi';

const WelcomeState = () => (
  <div className="welcome-container">
    <div className="welcome-icon">
      <GiWorld />
    </div>
    <h2 className="welcome-title">Explore the World</h2>
    <p className="welcome-subtitle">
      Search for any country to discover its capital, population, languages, currencies, and more.
    </p>
    <div className="welcome-hints">
      <span className="welcome-hint">🇫🇷 France</span>
      <span className="welcome-hint">🇯🇵 Japan</span>
      <span className="welcome-hint">🇧🇷 Brazil</span>
      <span className="welcome-hint">🇦🇺 Australia</span>
    </div>
  </div>
);

export default WelcomeState;
