"use client";

import { ROUTES } from "../utils/Routes/routesUtils";
import { useRouter } from "next/navigation";

const NotFoundPage = () => {
  // At this point of the execution, user must be logged-in because they succeeded the middleware.ts filter, so we don't need to check if they are logged-in.
  const router = useRouter();
  
  // Just send the logged-in user to the dashboard whenever they try to access a non-existing path.
  router.push(ROUTES.MENU.DISCOVER);
}

export default NotFoundPage;
