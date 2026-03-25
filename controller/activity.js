import { postData } from "./crud.js";

export async function logActivity(type, action, message) {
  const activity = {
    type: type,
    action: action,
    message: message,

    date: new Date().toLocaleString(),
  };

  await postData("activityLog", activity);
}
