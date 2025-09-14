import type { SVGProps } from 'react';

export default function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2v2.5" />
      <path d="M12 19.5V22" />
      <path d="M12 8.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 1 0 0-5Z" />
      <path d="m5 12 1.5 2.5" />
      <path d="m17.5 9.5 1.5 2.5" />
      <path d="m5 12 1.5-2.5" />
      <path d="m17.5 14.5 1.5-2.5" />
    </svg>
  );
}
