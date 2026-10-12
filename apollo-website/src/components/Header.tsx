import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { navItems } from '../content/site';

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the mobile menu after navigating.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="site-header">
      <a
        className="skip-link"
        href="#main"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('main')?.focus();
        }}
      >
        Skip to main content
      </a>
      <div className="wrap site-header__bar">
        <Link to="/" className="brand">
          <img className="logo logo--light" src="/images/apollo-logo.png" alt="Apollo Industries" width={68} height={44} />
          <img className="logo logo--dark" src="/images/apollo-logo-light.png" alt="Apollo Industries" width={68} height={44} />
        </Link>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? 'Close' : 'Menu'}
        </button>

        <nav id="site-nav" className={open ? 'site-nav is-open' : 'site-nav'} aria-label="Main">
          <ul className="site-nav__list">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    isActive ? 'site-nav__link is-active' : 'site-nav__link'
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li className="site-nav__action">
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  isActive ? 'btn btn--secondary btn--small is-active' : 'btn btn--secondary btn--small'
                }
              >
                Contact
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
