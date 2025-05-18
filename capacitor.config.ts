import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
	appId: "com.ipv.resqlink",
	appName: "resqlink",
	webDir: "dist",
	android: {
		buildOptions: {
			releaseType: "APK",
			keystorePath: "/home/gihyun/.android/debug.keystore",
			keystorePassword: "android",
			keystoreAlias: "androiddebugkey",
			keystoreAliasPassword: "android",
		},
	},
	server: {
		androidScheme: "http",
	},
	plugins: {
		CapacitorHttp: {
			enabled: true,
		},
	},
};

export default config;
