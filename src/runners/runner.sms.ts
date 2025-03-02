import useSmsListener from "@/hooks/useSmsListener";

addEventListener("listenToSms", (resolve: any, reject: any, args: any) => {
  console.log("NDRRMC Alert Received:", args.message.body);
  useSmsListener();
  resolve();
});
