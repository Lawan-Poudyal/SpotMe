import { useState, useRef, useEffect, useContext } from "react"
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Check, Loader2 } from 'lucide-react'
import { checkUsernameValidity, checkEmailValidity, checkPasswordValidity } from '../utility/formValidation'
import type { passwordError } from '../utility/formValidation'
import { handleLogIn as logInApi } from '../api/log-in'
import { handleSignUp as signUpApi } from '../api/sign-up'
import { googleSignIn } from '../api/google-sign-in'
import { handleEmailUniqueness } from '../api/checkEmailUniquness.js'
import { UserContext } from '../context/UserContext.js'
import type { LoginOrSignupBox } from '../types/LoginOrSignUpType'

export function LoginBox({ loggedIn, open, setOpen, setErrorMsg, setOpenErrorPopUp, openError }: LoginOrSignupBox): React.ReactNode {
    const timerReference = useRef<ReturnType<typeof setTimeout> | null>(null)
    const [userName, setUserName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [seePassword, setSeePassword] = useState<boolean>(false)
    const [isPassword, setIsPassword] = useState<boolean>(true)
    const [passwordErrorMessage, setPasswordErrorMessage] = useState<passwordError>({ num: true, totalLength: true, symbol: true })
    const [userNameErrorMessage, setUserNameErrorMessage] = useState<boolean>(true)
    const [emailErrorMessage, setEmailErrorMessage] = useState<boolean>(true)
    const [isLogInLoading, setIsLogInLoading] = useState<boolean>(false)
    const [isSignUpLoading, setIsSignUpLoading] = useState<boolean>(false)
    const [isEmailUniqueError, setIsEmailUniqueError] = useState<boolean>(true)
    const [passwordTouched, setPasswordTouched] = useState<boolean>(false)
    const userInfo = useContext(UserContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (userInfo?.contextState?.loggedIn) {
            navigate("/dashboard")
        }
    }, [])

    const debouncerFunction = async (email: string) => {
        setIsEmailUniqueError(true)
        if (checkEmailValidity(email) || loggedIn) return
        if (timerReference.current) {
            clearTimeout(timerReference.current as number)
            timerReference.current = null
        }
        timerReference.current = setTimeout(async () => {
            await handleEmailUniqueness(email, setErrorMsg, setOpenErrorPopUp, setIsEmailUniqueError)
        }, 1000)
    }

    const handleLogin = async () => {
        await logInApi(String(email), String(password), true, setOpenErrorPopUp, setErrorMsg, setIsLogInLoading)
    }

    const checkSubmissionPermission = () => {
        if (userNameErrorMessage || emailErrorMessage || passwordErrorMessage.num || passwordErrorMessage.symbol || passwordErrorMessage.totalLength || isEmailUniqueError) return false
        return true
    }

    const handleSingUp = async () => {
        if (loggedIn) return
        if (checkSubmissionPermission()) {
            await signUpApi(userName, email, password, setIsSignUpLoading, setOpen, setErrorMsg, setOpenErrorPopUp)
        }
    }

    const handleFormValidation = (validateWhat: "userName" | "email" | "password", validationString: string) => {
        if (validateWhat === "userName") setUserNameErrorMessage(checkUsernameValidity(validationString))
        else if (validateWhat === "email") setEmailErrorMessage(checkEmailValidity(validationString))
        else if (validateWhat === "password") setPasswordErrorMessage(checkPasswordValidity(validationString))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (loggedIn) handleLogin()
        else handleSingUp()
    }

    const inputClass = "w-full bg-[#2e2e2e] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white text-sm placeholder-[#555555] focus:outline-none focus:border-[#E8572A] focus:ring-1 focus:ring-[#E8572A]/40 transition-colors"
    const labelClass = "block text-[#aaaaaa] text-sm mb-1.5"
    const isLoading = loggedIn ? isLogInLoading : isSignUpLoading

    const passwordRequirements = [
        { label: "8+ characters", met: !passwordErrorMessage.totalLength },
        { label: "1 number", met: !passwordErrorMessage.num },
        { label: "1 symbol", met: !passwordErrorMessage.symbol },
    ]

    return (
        <div className="w-full max-w-md px-8 flex flex-col gap-6">
            {/* Header */}
            <div>
                <div className="text-white font-bold text-xl mb-1">
                    Spot<span className="text-[#E8572A]">Me</span>
                </div>
                <h1 className="text-white text-3xl font-bold mt-4 tracking-tight">
                    {loggedIn ? "Welcome back" : "Create an account"}
                </h1>
                <p className="text-[#888888] text-sm mt-1">
                    {loggedIn ? "Sign in to your account." : "Get started for free."}
                </p>
            </div>

            {/* Google button */}
            <button
                type="button"
                onClick={googleSignIn}
                className="w-full flex items-center justify-center gap-3 bg-[#2e2e2e] hover:bg-[#383838] active:bg-[#333333] border border-[#3a3a3a] rounded-lg py-3 text-white text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8572A]/50"
            >
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                    <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                    <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                    <path fill="#FBBC05" d="M4.5 10.48A4.8 4.8 0 0 1 4.5 7.52V5.45H1.83a8 8 0 0 0 0 7.1l2.67-2.07z"/>
                    <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.45L4.5 7.52c.52-1.56 1.98-3.34 4.48-3.34z"/>
                </svg>
                {loggedIn ? "Continue with Google" : "Sign up with Google"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-[#3a3a3a]" />
                <span className="text-[#555555] text-xs uppercase tracking-wider">or</span>
                <div className="flex-1 h-px bg-[#3a3a3a]" />
            </div>

            {/* Form */}
            <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
                {!loggedIn && (
                    <div>
                        <label className={labelClass} htmlFor="username">Username</label>
                        <input
                            id="username"
                            name="username"
                            autoComplete="username"
                            className={inputClass}
                            placeholder="Enter your username"
                            value={userName}
                            onChange={(e) => {
                                setUserName(e.target.value)
                                handleFormValidation("userName", e.target.value)
                            }}
                        />
                        <div className="min-h-[18px] mt-1">
                            {userNameErrorMessage && userName.trim().length > 0 && (
                                <span className="text-[#E8572A] text-xs block">Username must be 8 characters long</span>
                            )}
                        </div>
                    </div>
                )}

                <div>
                    <label className={labelClass} htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        autoComplete="email"
                        className={inputClass}
                        placeholder="Enter your email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                            debouncerFunction(e.target.value)
                            handleFormValidation("email", e.target.value)
                        }}
                    />
                    <div className="min-h-[18px] mt-1">
                        {emailErrorMessage && email.trim().length > 0 && !loggedIn && (
                            <span className="text-[#E8572A] text-xs block">Email format is invalid</span>
                        )}
                        {!emailErrorMessage && isEmailUniqueError && email.trim().length > 0 && !loggedIn && (
                            <span className="text-[#E8572A] text-xs block">Email already in use</span>
                        )}
                    </div>
                </div>

                <div>
                    <label className={labelClass} htmlFor="password">Password</label>
                    <div className="relative">
                        <input
                            id="password"
                            name="password"
                            autoComplete={loggedIn ? "current-password" : "new-password"}
                            className={`${inputClass} pr-11`}
                            placeholder="Enter your password"
                            type={isPassword ? "password" : "text"}
                            value={password}
                            onFocus={() => setPasswordTouched(true)}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                handleFormValidation("password", e.target.value)
                            }}
                        />
                        <button
                            type="button"
                            aria-label={seePassword ? "Hide password" : "Show password"}
                            aria-pressed={seePassword}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#aaaaaa] transition-colors focus:outline-none"
                            onClick={() => { setSeePassword(!seePassword); setIsPassword(!isPassword) }}
                        >
                            {seePassword ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                    </div>

                    {/* Live requirement checklist, signup only */}
                    {!loggedIn && (passwordTouched || password.trim().length > 0) && (
                        <ul className="flex items-center gap-3 mt-2">
                            {passwordRequirements.map((req) => (
                                <li
                                    key={req.label}
                                    className={`flex items-center gap-1 text-xs transition-colors ${req.met ? "text-white" : "text-[#666666]"}`}
                                >
                                    <span className={`flex items-center justify-center w-3.5 h-3.5 rounded-full border ${req.met ? "bg-[#E8572A] border-[#E8572A]" : "border-[#555555]"}`}>
                                        {req.met && <Check size={9} strokeWidth={3} className="text-white" />}
                                    </span>
                                    {req.label}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Forgot password (login only) */}
                {loggedIn && (
                    <div className="flex justify-end -mt-2">
                        <span className="text-[#E8572A] text-sm cursor-pointer hover:underline">Forgot password?</span>
                    </div>
                )}

                {/* Submit button */}
                <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-white hover:bg-[#f0f0f0] active:bg-[#e4e4e4] disabled:bg-[#3a3a3a] disabled:text-[#666666] text-black font-semibold rounded-lg py-3 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8572A]/50 disabled:cursor-not-allowed"
                    disabled={loggedIn
                        ? isLogInLoading
                        : isSignUpLoading || !checkSubmissionPermission()}
                >
                    {isLoading && <Loader2 size={16} className="animate-spin" />}
                    {loggedIn
                        ? (isLogInLoading ? "Signing in…" : "Sign in")
                        : (isSignUpLoading ? "Creating account…" : "Sign Up")}
                </button>
            </form>

            {/* Toggle login/signup */}
            <p className="text-center text-[#888888] text-sm">
                {loggedIn ? "Don't have an account? " : "Already have an account? "}
                <span
                    className="text-[#E8572A] cursor-pointer hover:underline"
                    onClick={() => navigate(loggedIn ? "../signup" : "../login")}
                >
                    {loggedIn ? "Create one" : "Sign in"}
                </span>
            </p>
        </div>
    )
}