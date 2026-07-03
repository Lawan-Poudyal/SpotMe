import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { LoginOrSignupBox } from '../types/LoginOrSignUpType';
import { Eye, EyeOff } from 'lucide-react';
import {
  checkUsernameValidity,
  checkEmailValidity,
  checkPasswordValidity,
} from '../utility/formValidation';
import type { passwordError } from '../utility/formValidation';
import { handleLogIn as logInApi } from '../api/log-in';
import { handleSignUp as signUpApi } from '../api/sign-up';
import { googleSignIn } from '../api/google-sign-in';
import { handleEmailUniqueness } from '../api/checkEmailUniquness.js';
import { useProfile } from '../context/zuContext.js';
import type { zuContextType } from '../context/zuContext.js';

export function LoginBox({
  loggedIn,
  setOpen,
  setErrorMsg,
  setOpenErrorPopUp,
}: LoginOrSignupBox): React.ReactNode {
  const timerReference = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [seePassword, setSeePassword] = useState<boolean>(false);
  const [isPassword, setIsPassword] = useState<boolean>(true);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<passwordError>({
    num: true,
    totalLength: true,
    symbol: true,
  });
  const [userNameErrorMessage, setUserNameErrorMessage] = useState<boolean>(true);
  const [emailErrorMessage, setEmailErrorMessage] = useState<boolean>(true);
  const [isLogInLoading, setIsLogInLoading] = useState<boolean>(false);
  const [isSignUpLoading, setIsSignUpLoading] = useState<boolean>(false);
  const [isEmailUniqueError, setIsEmailUniqueError] = useState<boolean>(true);
  const zuContextLoggedIn = useProfile((s: zuContextType) => s.loggedIn);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rawRedirect = searchParams.get('redirect');
  const redirectTo =
    rawRedirect?.startsWith('/') && !rawRedirect.startsWith('//') ? rawRedirect : '/dashboard';

  useEffect(() => {
    if (zuContextLoggedIn) {
      navigate('/dashboard');
    }
  }, []);

  const debouncerFunction = async (email: string) => {
    setIsEmailUniqueError(true);
    if (checkEmailValidity(email) || loggedIn) return;
    if (timerReference.current) {
      clearTimeout(timerReference.current as number);
      timerReference.current = null;
    }
    timerReference.current = setTimeout(async () => {
      await handleEmailUniqueness(email, setErrorMsg, setOpenErrorPopUp, setIsEmailUniqueError);
    }, 1000);
  };

  const handleLogin = async () => {
    await logInApi(
      String(email),
      String(password),
      true,
      setOpenErrorPopUp,
      setErrorMsg,
      setIsLogInLoading,
      redirectTo,
    );
  };

  const checkSubmissionPermission = () => {
    if (
      userNameErrorMessage ||
      emailErrorMessage ||
      passwordErrorMessage.num ||
      passwordErrorMessage.symbol ||
      passwordErrorMessage.totalLength ||
      isEmailUniqueError
    )
      return false;
    else return true;
  };

  const handleSingUp = async () => {
    if (loggedIn) return;
    if (checkSubmissionPermission()) {
      console.log(password);
      await signUpApi(
        userName,
        email,
        password,
        setIsSignUpLoading,
        setOpen,
        setErrorMsg,
        setOpenErrorPopUp,
      );
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loggedIn) {
      handleLogin();
    } else {
      handleSingUp();
    }
  };

  const handleFormValidation = (
    validateWhat: 'userName' | 'email' | 'password',
    validationString: string,
  ) => {
    if (validateWhat === 'userName') {
      const userNameError = checkUsernameValidity(validationString);
      setUserNameErrorMessage(userNameError);
    } else if (validateWhat === 'email') {
      const emailError = checkEmailValidity(validationString);
      setEmailErrorMessage(emailError);
    } else if (validateWhat === 'password') {
      const passwordError = checkPasswordValidity(validationString);
      setPasswordErrorMessage(passwordError);
    }
  };

  const inputCls =
    'w-full h-11 bg-[#111111] border border-[#2a2a2a] rounded-lg px-3 text-sm text-white placeholder-[#555555] outline-none transition-colors hover:border-[#3a3a3a] focus:border-[#E8572A]';

  return (
    <div className="w-full max-w-sm flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-white text-3xl font-bold tracking-tight">
          {loggedIn ? 'Welcome back' : 'Create an account'}
        </h1>
        <p className="text-[#888888] text-sm">
          {loggedIn ? 'Sign in to your SpotMe account' : "Start finding every photo you're in"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="flex flex-col gap-5">
          {!loggedIn ? (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-[#888888]">
                User Name <span className="text-[#E8572A]">*</span>
              </label>
              <input
                type="text"
                className={inputCls}
                placeholder="johndoe"
                value={userName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setUserName(e.target.value);
                  handleFormValidation('userName', e.target.value);
                }}
              />
              {userNameErrorMessage &&
              String(userName).trim().length !== 0 &&
              userName !== null &&
              !loggedIn ? (
                <span className="text-[#E8572A] text-xs">
                  Username must be at least 8 characters
                </span>
              ) : null}
            </div>
          ) : null}

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#888888]">
              Email <span className="text-[#E8572A]">*</span>
            </label>
            <input
              type="email"
              className={inputCls}
              placeholder="you@example.com"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value);
                debouncerFunction(e.target.value);
                handleFormValidation('email', e.target.value);
              }}
            />
            {emailErrorMessage &&
            String(email).trim().length !== 0 &&
            email !== null &&
            !loggedIn ? (
              <span className="text-[#E8572A] text-xs">Invalid email format</span>
            ) : isEmailUniqueError &&
              String(email).trim().length !== 0 &&
              email !== null &&
              !loggedIn ? (
              <span className="text-[#E8572A] text-xs">Email already in use</span>
            ) : null}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#888888]">
              Password <span className="text-[#E8572A]">*</span>
            </label>
            <div className="relative">
              <input
                className={`${inputCls} pr-10`}
                placeholder="••••••••"
                type={isPassword ? 'password' : 'text'}
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                  handleFormValidation('password', e.target.value);
                }}
              />
              {!seePassword ? (
                <button
                  type="button"
                  className="absolute top-1/2 -translate-y-1/2 right-3 text-[#555555] hover:text-[#888888] cursor-pointer transition-colors bg-transparent border-none p-0 focus:outline-none"
                  onClick={() => {
                    setSeePassword(true);
                    setIsPassword(false);
                  }}
                >
                  <EyeOff size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  className="absolute top-1/2 -translate-y-1/2 right-3 text-[#555555] hover:text-[#888888] cursor-pointer transition-colors bg-transparent border-none p-0 focus:outline-none"
                  onClick={() => {
                    setSeePassword(false);
                    setIsPassword(true);
                  }}
                >
                  <Eye size={16} />
                </button>
              )}
            </div>
            {(passwordErrorMessage.totalLength ||
              passwordErrorMessage.symbol ||
              passwordErrorMessage.num) &&
            String(password).trim().length !== 0 &&
            password !== null &&
            !loggedIn ? (
              <span className="text-[#E8572A] text-xs">
                {passwordErrorMessage.totalLength
                  ? 'Password must be at least 8 characters'
                  : passwordErrorMessage.num
                    ? 'Password must contain at least one number'
                    : passwordErrorMessage.symbol
                      ? 'Password must contain at least one symbol'
                      : ''}
              </span>
            ) : null}
          </div>

          <span
            className="text-center text-sm cursor-pointer text-[#888888] hover:text-white underline underline-offset-2 transition-colors"
            onClick={() => {
              navigate(loggedIn ? '../signup' : '../login');
            }}
          >
            {loggedIn ? "Don't have an account" : 'Already have an account'}
          </span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-2.5">
          <button
            type="submit"
            disabled={
              loggedIn
                ? isLogInLoading || !email || !password
                : isSignUpLoading || !checkSubmissionPermission()
            }
            className="relative h-11 w-full rounded-lg bg-[#E8572A] text-white font-semibold text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-[#E8572A]/10 transition-colors flex items-center justify-center gap-2 hover:border-[#E8572A]/20 "
          >
            {(loggedIn ? isLogInLoading : isSignUpLoading) && (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            )}
            {loggedIn
              ? isLogInLoading
                ? 'Logging in…'
                : 'Log In'
              : isSignUpLoading
                ? 'Signing up…'
                : 'Sign Up'}
          </button>

          <div className="flex items-center gap-3 my-0.5">
            <div className="flex-1 h-px bg-[#2a2a2a]" />
            <span className="text-xs text-neutral-500">or</span>
            <div className="flex-1 h-px bg-[#2a2a2a]" />
          </div>

          <button
            type="button"
            onClick={googleSignIn}
            className="h-11 w-full rounded-lg bg-[#111111] border border-[#2a2a2a] hover:border-[#444444] hover:bg-[#181818] active:bg-[#101010] text-white font-semibold text-sm flex items-center justify-center gap-2.5 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true" className="shrink-0">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
            </svg>
            {loggedIn ? 'Continue with Google' : 'Sign up with Google'}
          </button>
        </div>
      </form>
    </div>
  );
}
