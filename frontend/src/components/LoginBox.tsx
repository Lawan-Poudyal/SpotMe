import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
// the loogedIn variable is written in a bad way it's acutally determines whether the user wants to log in or sign up

export function LoginBox({
  loggedIn,
  open,
  setOpen,
  setErrorMsg,
  setOpenErrorPopUp,
  openError,
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

  // ── Shared input class ──────────────────────────────────────────────────────
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

      {/* Fields */}
      <div className="flex flex-col gap-5">
        {/* Username — signup only */}
        {!loggedIn ? (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#888888]">
              User Name <span className="text-[#E8572A]">*</span>
            </label>
            <input
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
              <span className="text-[#E8572A] text-xs">Username must be at least 8 characters</span>
            ) : null}
          </div>
        ) : null}

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[#888888]">
            Email <span className="text-[#E8572A]">*</span>
          </label>
          <input
            className={inputCls}
            placeholder="you@example.com"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value);
              debouncerFunction(e.target.value);
              handleFormValidation('email', e.target.value);
            }}
          />
          {emailErrorMessage && String(email).trim().length !== 0 && email !== null && !loggedIn ? (
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
              <EyeOff
                size={16}
                className="absolute top-1/2 -translate-y-1/2 right-3 text-[#555555] hover:text-[#888888] cursor-pointer transition-colors"
                onClick={() => {
                  setSeePassword(true);
                  setIsPassword(false);
                }}
              />
            ) : (
              <Eye
                size={16}
                className="absolute top-1/2 -translate-y-1/2 right-3 text-[#555555] hover:text-[#888888] cursor-pointer transition-colors"
                onClick={() => {
                  setSeePassword(false);
                  setIsPassword(true);
                }}
              />
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

        {/* Toggle link */}
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
      <div className="flex flex-col gap-3">
        <button
          disabled={loggedIn ? isLogInLoading : isSignUpLoading || !checkSubmissionPermission()}
          onClick={() => {
            if (loggedIn) {
              handleLogin();
            } else {
              handleSingUp();
            }
          }}
          className="h-11 w-full rounded-lg bg-[#E8572A] text-white font-semibold text-sm
            hover:bg-[#d14e25] active:bg-[#bf4520]
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-colors"
        >
          {loggedIn
            ? isLogInLoading
              ? 'Logging in…'
              : 'Log In'
            : isSignUpLoading
              ? 'Signing up…'
              : 'Sign Up'}
        </button>

        <button
          onClick={googleSignIn}
          className="h-11 w-full rounded-lg bg-[#111111] border border-[#2a2a2a]
            hover:border-[#444444] hover:bg-[#181818]
            text-white font-semibold text-sm
            flex items-center justify-center gap-2.5
            transition-colors"
        >
          {loggedIn ? 'Login with Google' : 'Sign up with Google'}
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
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
        </button>
      </div>
    </div>
  );
}

// ── Preview wrapper ────────────────────────────────────────────────────────────
export default function App() {
  const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center px-4">
      <LoginBox
        loggedIn={false}
        open={open}
        setOpen={setOpen}
        openError={openError}
        setOpenErrorPopUp={setOpenError}
        setErrorMsg={setErrorMsg}
      />
    </div>
  );
}
