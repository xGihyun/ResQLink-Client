import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
	appId: "com.ipv.resqlink",
	appName: "resqlink",
	webDir: "dist",
	plugins: {
		BackgroundRunner: {
			label: "com.ipv.background.task",
			src: "runners/runner.sms.ts",
			event: "listenToSms",
			repeat: true,
			interval: 15,
			autoStart: true,
		},
		PushNotifications: {
			presentationOptions: ["badge", "sound", "alert"],
		},
		LocalNotifications: {
			smallIcon: "ic_stat_icon_config_sample",
			iconColor: "#488AFF",
			sound: "beep.wav",
		},
	},
};

export default config;
