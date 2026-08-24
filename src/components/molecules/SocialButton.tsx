import { Mail } from 'lucide-react';
import { Button } from '@/components/atoms/Button';

function AppleIcon() {
  return (
    <svg className="h-4 w-4 fill-current" viewBox="0 0 170 170">
      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.03-7.62-7.85-11.77-14.44-6-9.59-10.74-20.47-14.23-32.63-3.48-12.17-5.23-23.47-5.23-33.91 0-14.07 3.48-25.75 10.45-35.04 6.97-9.29 15.82-14.06 26.56-14.31 4.79 0 10.2 1.25 16.24 3.76 6.03 2.5 9.77 3.76 11.22 3.76 1.88 0 5.86-1.32 11.94-3.95 6.09-2.63 11.53-3.76 16.33-3.4 12.19.98 21.84 5.76 28.95 14.33-10.66 6.49-15.88 15.42-15.66 26.79.22 8.92 3.76 16.37 10.62 22.36 6.86 5.99 15.01 9.4 24.46 10.23-2.18 6.64-4.8 13.06-7.87 19.26zM119.22 31.85c0-7.23 2.65-13.97 7.95-20.21 5.3-6.24 11.89-10.36 19.78-12.36.22 1.31.33 2.47.33 3.49 0 7.23-2.76 14.06-8.28 20.49-5.52 6.43-12.24 10.39-20.17 11.89-.22-1.09-.33-2.19-.33-3.3z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export function SocialButton(props: {
  provider: 'apple' | 'google' | 'email';
  label: string;
  onClick?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}) {
  if (props.provider === 'apple') {
    return (
      <Button
        variant="primary"
        fullWidth
        startIcon={<AppleIcon />}
        onClick={props.onClick}
        isLoading={props.isLoading}
        disabled={props.disabled}
        className="border-none bg-black text-white shadow-xs hover:bg-neutral-900"
      >
        {props.label}
      </Button>
    );
  }

  if (props.provider === 'google') {
    return (
      <Button
        variant="outline"
        fullWidth
        startIcon={<GoogleIcon />}
        onClick={props.onClick}
        isLoading={props.isLoading}
        disabled={props.disabled}
        className="border-neutral-200 bg-white text-neutral-800 shadow-2xs hover:bg-neutral-50"
      >
        {props.label}
      </Button>
    );
  }

  return (
    <Button
      variant="secondary"
      fullWidth
      startIcon={<Mail className="h-4 w-4 text-neutral-800" />}
      onClick={props.onClick}
      isLoading={props.isLoading}
      disabled={props.disabled}
      className="bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
    >
      {props.label}
    </Button>
  );
}
