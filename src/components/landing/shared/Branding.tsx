
import logo from '../../../assets/images/logo-parte.svg'

export function Branding() {
  return (
    <div className="w-full bg-[#12202b] py-4 flex justify-center items-center">
      <a href="https://smartinvite.me" target="_blank" rel="noopener noreferrer">
        <img
          src={logo}
          alt="Logo smartinvite.me"
          className="h-8 w-auto"
          style={{ filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.4))' }}
        />
      </a>
    </div>
  );
} 