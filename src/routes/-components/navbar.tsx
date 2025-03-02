import { Link, useLocation } from "@tanstack/react-router";
import { JSX } from "react";

export function Navbar(): JSX.Element {
	const location = useLocation();

	return (
		<nav className="w-full h-20 fixed bottom-0 left-0 bg-background px-5 content-center">
			<div className="w-full flex items-center justify-center gap-10">
				<Link to="/dashboard" className={`${location.href === '/dashboard' ? 'text-primary' : 'text-foreground'}`}>
					<svg
						width="25"
						height="24"
						viewBox="0 0 25 24"
						fill="currentColor"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M14.4228 2.5C18.1238 2.911 21.0478 5.831 21.4628 9.532"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							d="M14.4228 6.04297C16.1938 6.38697 17.5778 7.77197 17.9228 9.54297"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M11.1013 12.4724C15.0903 16.4604 15.9953 11.8467 18.5351 14.3848C20.9836 16.8328 22.392 17.3232 19.2886 20.4247C18.9001 20.737 16.4311 24.4943 7.75429 15.8197C-0.923582 7.144 2.83139 4.67244 3.14377 4.28395C6.25359 1.17385 6.73665 2.58938 9.18522 5.03733C11.724 7.5765 7.11236 8.48441 11.1013 12.4724Z"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</Link>

				<Link to="/main/map" className={`${location.href === '/main/map' ? 'text-primary' : 'text-foreground'}`}>
					<svg
						width="25"
						height="24"
						viewBox="0 0 25 24"
						fill="currentColor"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M15.4312 6.13734L8.69482 1.82812L1.56982 6.75V22.5L8.70842 17.8627L15.4448 22.1719L22.5698 17.25V1.5L15.4312 6.13734ZM14.6948 19.7344L9.44482 16.3594V4.26562L14.6948 7.64062V19.7344Z"
						/>
					</svg>
				</Link>

				<Link to="/main/preferences" className={`${location.href === '/main/preferences' ? 'text-primary' : 'text-foreground'}`}>
					<svg
						width="25"
						height="24"
						viewBox="0 0 25 24"
						fill="currentColor"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M12.0315 11.892H12.0625C14.8945 11.892 17.1985 9.58802 17.1985 6.75602C17.1985 3.92402 14.8945 1.61902 12.0625 1.61902C9.22957 1.61902 6.92557 3.92402 6.92557 6.75302C6.92057 8.12202 7.44957 9.41002 8.41357 10.381C9.37657 11.351 10.6615 11.888 12.0315 11.892ZM8.42557 6.75602C8.42557 4.75102 10.0576 3.11902 12.0625 3.11902C14.0675 3.11902 15.6985 4.75102 15.6985 6.75602C15.6985 8.76102 14.0675 10.392 12.0625 10.392H12.0345C11.0665 10.39 10.1595 10.01 9.47757 9.32302C8.79557 8.63702 8.42257 7.72602 8.42557 6.75602Z"
						/>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M4.47534 18.7559C4.47534 22.3809 10.1913 22.3809 12.0693 22.3809C13.9473 22.3809 19.6643 22.3809 19.6643 18.7339C19.6643 15.9409 16.1863 13.5809 12.0693 13.5809C7.95334 13.5809 4.47534 15.9509 4.47534 18.7559ZM5.97534 18.7559C5.97534 17.0209 8.58134 15.0809 12.0693 15.0809C15.5583 15.0809 18.1643 17.0099 18.1643 18.7339C18.1643 20.1579 16.1133 20.8809 12.0693 20.8809C8.02634 20.8809 5.97534 20.1659 5.97534 18.7559Z"
						/>
					</svg>
				</Link>
			</div>
		</nav>
	);
}
