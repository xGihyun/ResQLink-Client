import { useEffect } from "react";
import { LocalNotifications } from "@capacitor/local-notifications";

declare var SMSReceive: any; // Cordova SMS plugin

const useSmsListener = () => {
  useEffect(() => {
    const startListening = async () => {
      try {
        SMSReceive.startWatch(
          (msg: any) => handleSms(msg),
          (err: any) => console.error("SMS Watch Error", err)
        );
      } catch (error) {
        console.error("SMS Receive Plugin Error", error);
      }
    };

    const handleSms = async (message: any) => {
      if (message?.address?.includes("NDRRMC")) {
        console.log("NDRRMC Alert Received:", message.body);
        await sendNotification(message.body);
      }
    };

    const sendNotification = async (msg: string) => {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: "NDRRMC Alert",
            body: msg,
            id: new Date().getTime(),
            schedule: { at: new Date(Date.now() + 1000) },
          },
        ],
      });
    };

    startListening();

    return () => {
      if (SMSReceive) SMSReceive.stopWatch();
    };
  }, []);
};

export default useSmsListener;
