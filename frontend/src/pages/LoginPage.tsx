import { LoginBox } from '../components/LoginBox';
import { useState } from 'react';
import type { LoginOrSignUp } from '../types/LoginOrSignUpType';
import PopUpBox from '../components/PopupBox';
import { ScanFace, Zap, ShieldCheck } from 'lucide-react';

export function LoginPage({ loggedIn }: LoginOrSignUp): React.ReactNode {
  const [openRegistrationPopUp, setOpenRegistrationPopUp] = useState<boolean>(false);
  const [openErrorPopUp, setOpenErrorPopUp] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const features = [
    { icon: ScanFace, label: 'No tagging needed' },
    { icon: Zap, label: 'Results in seconds' },
    { icon: ShieldCheck, label: 'Private by default' },
  ];

  return (
    <div className="h-screen w-full bg-[#1a1a1a] flex flex-col md:flex-row md:flex-nowrap overflow-y-auto">
      <PopUpBox
        title="You're almost in!"
        subTitle="We just emailed you a sign-in link. Check your inbox to verify."
        open={openRegistrationPopUp}
        buttonText="Close"
        setOpen={setOpenRegistrationPopUp}
      />

      <PopUpBox
        title=" Submission Error"
        subTitle={errorMsg}
        open={openErrorPopUp}
        setOpen={setOpenErrorPopUp}
      />

      <div className="hidden md:flex md:w-[45%] h-full bg-[#111111] flex-col justify-between p-12 relative overflow-hidden">
        <div
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(232,87,42,0.16) 0%, rgba(232,87,42,0) 70%)',
          }}
          aria-hidden="true"
        />

        <div className="text-white font-bold text-2xl tracking-tight relative z-10">
          Spot<span className="text-[#E8572A]">Me</span>
        </div>

        <div className="flex flex-col gap-6 relative z-10">
          <h2 className="text-white text-[44px] leading-[1.08] font-bold tracking-tight">
            Find every photo
            <br />
            you're in, <span className="text-[#E8572A]">instantly.</span>
          </h2>

          <p className="text-[#888888] text-base leading-relaxed max-w-sm">
            No more scrolling through hundreds of photos. Upload one picture of yourself and we do
            the rest.
          </p>
        </div>

        <div className="flex items-center gap-6 relative z-10">
          {features.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-[#888888] text-xs">
              <Icon size={15} className="text-[#E8572A]" />

              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full md:w-[55%] min-h-screen md:h-full flex items-center justify-center py-12">
        <LoginBox
          loggedIn={loggedIn}
          open={openRegistrationPopUp}
          setOpen={setOpenRegistrationPopUp}
          openError={openErrorPopUp}
          setOpenErrorPopUp={setOpenErrorPopUp}
          setErrorMsg={setErrorMsg}
        />
      </div>
    </div>
  );
}
