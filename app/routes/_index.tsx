import type { MetaFunction } from "@remix-run/react";

// export const meta: MetaFunction = () => {
// 	return [
// 		{ title: "New Remix App" },
// 		{
// 			name: "description",
// 			content: "Welcome to Remix! Using Vite and Cloudflare!",
// 		},
// 	];
// };

export default function Index() {
  return (
    <div className="not-prose hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">What's up?</h1>
          <p className="py-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <button className="btn btn-primary">Get Started</button>
        </div>
      </div>
    </div>
  )
}
