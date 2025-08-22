import { useEffect, useRef } from "react";
import useInGameStore from "../stores/Kahoot/useInGameStore";
import { usePathname, useRouter } from "next/navigation";
import { kickingTheGuest, kickingTheHost } from "../utils/Lobby/lobbyUtils";

const useBackButtonConfirm = () => {
  const { isHost, terminateGameSession } = useInGameStore();
  const router = useRouter();
  const ignoreNext = useRef(false);
  const pathname = usePathname();

  useEffect(() => {
    const handlePopState = () => {
      if (ignoreNext.current) {
        ignoreNext.current = false;
        return;
      }

      const confirmed = window.confirm("Are you sure you want to exit the game?");
      if (!confirmed) {
        ignoreNext.current = true;
        history.go(1);
      } else {
        terminateGameSession()
          .finally(() => 
            isHost
              ? kickingTheHost(pathname, router)
              : kickingTheGuest(router)
          );
      }
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    history.pushState(null, "", window.location.href);

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
};

export default useBackButtonConfirm;
