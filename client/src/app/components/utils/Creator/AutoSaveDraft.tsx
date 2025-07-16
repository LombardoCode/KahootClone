import { useEffect } from "react";
import useKahootCreatorStore from "@/app/stores/Kahoot/useKahootCreatorStore";
import { saveKahootDraft } from "@/app/utils/KahootCreator/kahootCreatorUtils";
import { Kahoot } from "@/app/interfaces/Kahoot/Kahoot.interface";
import { debugLog } from "@/app/utils/debugLog";
var debounce = require('lodash.debounce');

const AutoSaveDraft = () => {
  const { kahoot, isKahootFormDirty, resetIsKahootFormDirty } = useKahootCreatorStore();

  useEffect(() => {
    if (!kahoot || !isKahootFormDirty) return;

    const debounced = debounce((kahoot: Kahoot) => {
      saveKahootDraft(kahoot, resetIsKahootFormDirty);
    }, 1000);

    debounced(kahoot);

    return () => {
      debounced.cancel();
    };
  }, [JSON.stringify(kahoot), isKahootFormDirty]);

  return null;
};

export default AutoSaveDraft;
