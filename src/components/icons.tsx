import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="2"></circle>
      <path d="M12 2a10 10 0 0 0-7.53 16.59"></path>
      <path d="M12 22a10 10 0 0 0 7.53-16.59"></path>
      <path d="M2 12a10 10 0 0 0 16.59 7.53"></path>
      <path d="M22 12a10 10 0 0 0-16.59-7.53"></path>
    </svg>
  );
}
