const ThemeToggle = ({ theme, setTheme }) => (
  <button
    className="theme-toggle-btn"
    onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
  >
    {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
  </button>
);

export default ThemeToggle;
