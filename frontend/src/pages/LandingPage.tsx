import { Camera, Check, User, ArrowDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

// `match: true` cells render a checkmark, others render a person icon.
const gridCells = [
    { color: "bg-[#E2632F]", match: false },
    { color: "bg-[#3B7DD8]", match: false },
    { color: "bg-[#2FA66B]", match: true },
    { color: "bg-[#7C6FD1]", match: false },
    { color: "bg-[#8A8A8A]", match: false },
    { color: "bg-[#2FA66B]", match: true },
    { color: "bg-[#C8841A]", match: false },
    { color: "bg-[#D44E89]", match: true },
    { color: "bg-[#E2632F]", match: false },
];

const steps = [
    {
        number: 1,
        title: "Join or create an event",
        description:
            "Organizers set up an event and share a link. Attendees join with one click.",
    },
    {
        number: 2,
        title: "Photos get added",
        description:
            "Organizers upload all photos from the event into one shared album.",
    },
    {
        number: 3,
        title: "Upload a photo of yourself",
        description:
            "We scan the album and pull out every photo you appear in. That's it.",
    },
];

export default function LandingPage() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-[#262626] text-white">
            {/* Header */}
            <header className="border-b border-white/10">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
                    <div className="text-xl font-bold">
                        Spot<span className="text-[#E2632F]">Me</span>
                    </div>
                    <nav className="flex items-center gap-3">
                        <button onClick={() => navigate("/login")} className="rounded-full border border-white/25 px-5 py-2 text-sm font-medium transition-colors hover:bg-white/10">
                            Log in
                        </button>
                        <button onClick={() => navigate("/signup")} className="rounded-full border border-white/25 px-5 py-2 text-sm font-medium transition-colors hover:bg-white/10">
                            Sign up
                        </button>
                    </nav>
                </div>
            </header>

            {/* Hero */}
            <section className="mx-auto max-w-6xl px-6 py-20">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    {/* Left: copy */}
                    <div>
                        <div className="mb-5 flex items-center gap-2 text-sm text-white/60">
                            <Camera className="h-4 w-4" />
                            <span>Event photo finder</span>
                        </div>

                        <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
                            Your photos from any event,{" "}
                            <span className="text-[#E2632F]">found instantly.</span>
                        </h1>

                        <p className="mt-6 max-w-md text-lg text-white/60">
                            Upload a photo of yourself. We'll find every picture you're in
                            — from any event album — in seconds.
                        </p>

                        <div className="mt-8 flex items-center gap-4">

                            <button onClick={() => navigate("/signup")} className="rounded-lg border border-white/25 px-6 py-3 font-semibold transition-colors hover:bg-white/10">
                                Get started
                            </button>
                            <button onClick={() => navigate("/login")} className="rounded-lg border border-white/25 px-6 py-3 font-semibold transition-colors hover:bg-white/10">
                                Log in
                            </button>
                        </div>
                    </div>

                    {/* Right: photo grid illustration */}
                    <div className="flex flex-col items-center">
                        <div className="grid grid-cols-3 gap-3">
                            {gridCells.map((cell, i) => (
                                <div
                                    key={i}
                                    className={`flex h-24 w-24 items-center justify-center rounded-2xl sm:h-28 sm:w-28 ${cell.color}`}
                                >
                                    {cell.match ? (
                                        <Check className="h-7 w-7 text-white" strokeWidth={3} />
                                    ) : (
                                        <User className="h-7 w-7 text-white/90" strokeWidth={2} />
                                    )}
                                </div>
                            ))}
                        </div>
                        <p className="mt-4 text-sm text-white/60">
                            Green = your photos
                        </p>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="border-t border-white/10">
                <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-3">
                    {steps.map((step) => (
                        <div key={step.number} className="flex gap-4">
                            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-white/25 text-sm font-semibold">
                                {step.number}
                            </div>
                            <div>
                                <h3 className="font-semibold">{step.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-white/60">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="relative border-t border-white/10">
                <button
                    aria-label="Scroll down"
                    className="absolute left-1/2 top-0 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-[#262626] transition-colors hover:bg-white/10"
                >
                    <ArrowDown className="h-4 w-4" />
                </button>
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 text-sm text-white/60 sm:flex-row">
                    <span>© 2026 SpotMe</span>
                    <div className="flex gap-6">
                        <a href="#" className="transition-colors hover:text-white">
                            Privacy
                        </a>
                        <a href="#" className="transition-colors hover:text-white">
                            Terms
                        </a>
                        <a href="#" className="transition-colors hover:text-white">
                            Contact
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}