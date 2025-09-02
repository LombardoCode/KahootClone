'use client';

import { redirect } from "next/navigation";
import { ROUTES } from "../utils/Routes/routesUtils";

const DiscoverMenuPage = () => {
  redirect(ROUTES.MENU.DISCOVER);
}

export default DiscoverMenuPage;
