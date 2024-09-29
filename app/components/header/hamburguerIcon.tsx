// components/HamburgerIcon.tsx
'use client'

interface HamburgerIconProps {
  isOpen: boolean;
  onClick: () => void;
}

const HamburgerIcon = ({ isOpen, onClick }: HamburgerIconProps) => {
  return (
    <div
      className={`hamburger-icon ${isOpen ? 'open' : ''} absolute left-5 z-40 w-2/12`}
      onClick={onClick}
    >
      <div className="bar bg-primary-yellow"></div>
      <div className="bar bg-primary-yellow"></div>
      <div className="bar bg-primary-yellow"></div>

      <style jsx>{`
        .hamburger-icon {
          display: flex;
          flex-direction: column;
          cursor: pointer;
        }

        .bar {
          width: 30px;
          height: 3px;
          margin: 6px 0;
          transition: 0.4s;
        }

        .open .bar:nth-child(1) {
          transform: rotate(-45deg) translate(-15px, 16px);
        }

        .open .bar:nth-child(2) {
          opacity: 0;
        }

        .open .bar:nth-child(3) {
          transform: rotate(45deg) translate(-5px, -6px);
        }
      `}</style>
    </div>
  );
};

export default HamburgerIcon;