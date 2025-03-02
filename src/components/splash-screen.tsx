import { JSX } from "react";

export function SplashScreen(): JSX.Element {
	return (
		<div className="w-full h-svh px-20 bg-background flex-col justify-center items-center inline-flex overflow-hidden">
			<div className="self-stretch h-[196px] flex-col justify-start items-center gap-6 inline-flex">
				<div data-svg-wrapper className="relative">
					<svg
						width="100"
						height="100"
						viewBox="0 0 100 100"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<g clip-path="url(#clip0_18_757)">
							<path
								d="M62.26 54.9H55.11V62.24H44.89V54.9H37.74V45.16H44.89V37.77H55.11V45.16H62.26V54.9Z"
								fill="#5BBEA9"
							/>
							<path
								d="M88 0H12C5.4 0 0 5.4 0 12V88C0 94.6 5.4 100 12 100H88C94.6 100 100 94.6 100 88V12C100 5.4 94.6 0 88 0ZM70.08 57.74C70.55 59.17 70.76 60.58 70.76 61.93C70.76 71.9 59.01 78.87 50 72.33C47.56 74.1 44.92 74.88 42.37 74.88C34.21 74.88 26.94 66.9 29.92 57.74C26.18 55.03 24.51 51.15 24.51 47.32C24.51 40.66 29.56 34.14 37.59 34.14C39.55 28.13 44.77 25.12 50 25.12C55.23 25.12 60.45 28.13 62.41 34.14C75.05 34.14 80.31 50.31 70.08 57.74Z"
								fill="#5BBEA9"
							/>
						</g>
						<defs>
							<clipPath id="clip0_18_757">
								<rect width="100" height="100" fill="white" />
							</clipPath>
						</defs>
					</svg>
				</div>
				<div className="self-stretch text-center">
					<div className="text-[#5bbea9] text-4xl font-black font-playfair-display">
						ResQLink
					</div>
					<div className="text-[#5bbea9] text-base font-medium font-['Poppins']">
						Stay Safe And Connected
					</div>
				</div>
			</div>
		</div>
	);
}
