
import { LoginBox } from "../components/LoginBox"
import { useState } from "react"
import type { LoginOrSignUp } from "../types/LoginOrSignUpType"
import PopUpBox from "../components/PopupBox"
import { ScanFace, ShieldCheck, Zap, Quote } from "lucide-react"
 
export function LoginPage({ loggedIn }: LoginOrSignUp): React.ReactNode {
    const [openRegistrationPopUp, setOpenRegistrationPopUp] = useState<boolean>(false)
    const [openErrorPopUp, setOpenErrorPopUp] = useState<boolean>(false)
    const [errorMsg, setErrorMsg] = useState<string>("")
 
    const features = [
        { icon: ScanFace, label: "No tagging needed" },
        { icon: Zap, label: "Results in seconds" },
        { icon: ShieldCheck, label: "Private by default" },
    ]
 
    return (
        <div className="h-screen w-full bg-[#1a1a1a] flex flex-col md:flex-row md:flex-nowrap overflow-y-auto">
            <PopUpBox title="Successfully Registered" subTitle="Close this dialog and log in to the system" open={openRegistrationPopUp} setOpen={setOpenRegistrationPopUp} />
            <PopUpBox title="⚠️ Submission Error" subTitle={errorMsg} open={openErrorPopUp} setOpen={setOpenErrorPopUp} />
 
            {/* Left marketing panel */}
            <div className="hidden md:flex md:w-[45%] h-full bg-[#111111] flex-col justify-between p-12 relative overflow-hidden">
                {/* ambient accent glow, purely decorative */}
                <div
                    className="absolute -top-24 -right-24 w-80 h-80 rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(circle, rgba(232,87,42,0.16) 0%, rgba(232,87,42,0) 70%)" }}
                    aria-hidden="true"
                />
 
                <div className="text-white font-bold text-2xl tracking-tight relative z-10">
                    Spot<span className="text-[#E8572A]">Me</span>
                </div>
 
                <div className="flex flex-col gap-6 relative z-10">
                    <h2 className="text-white text-[44px] leading-[1.08] font-bold tracking-tight">
                        Find every photo<br />
                        you're in, <span className="text-[#E8572A]">instantly.</span>
                    </h2>
                    <p className="text-[#888888] text-base leading-relaxed max-w-sm">
                        No more scrolling through hundreds of photos. Upload one picture of yourself and we do the rest.
                    </p>
 
                    {/* Testimonial */}
                    <div className="border-l-2 border-[#E8572A] pl-4 mt-4 relative">
                        <Quote className="absolute -left-1 -top-1 text-[#E8572A] opacity-20" size={28} aria-hidden="true" />
                        <p className="text-[#cccccc] text-sm italic leading-relaxed">
                            "Found all my photos from convocation in under 5 seconds. Didn't expect it to actually work that well."
                        </p>
                        <p className="text-[#E8572A] text-sm font-medium mt-2">— Priya S.</p>
                    </div>
                </div>
 
                {/* Feature row, replaces the empty spacer */}
                <div className="flex items-center gap-6 relative z-10">
                    {features.map(({ icon: Icon, label }) => (
                        <div key={label} className="flex items-center gap-2 text-[#888888] text-xs">
                            <Icon size={15} className="text-[#E8572A]" />
                            <span>{label}</span>
                        </div>
                    ))}
                </div>
            </div>
 
            {/* Right form panel */}
            <div className="w-full md:w-[55%] min-h-screen md:h-full flex items-center justify-center py-12 bg-[#242424]">
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
    )
}
 