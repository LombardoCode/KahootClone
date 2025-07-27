import { Kahoot } from "@/app/interfaces/Kahoot/Kahoot.interface";
import axiosInstance from "../axiosConfig";

export const saveKahootDraft = async (kahoot: Kahoot, resetIsKahootFormDirty: () => void) => {
  try {
    await axiosInstance.put('/kahootcreator/drafts', {
      id: kahoot?.id,
      title: kahoot?.title,
      description: kahoot?.description,
      mediaUrl: kahoot?.mediaUrl,
      isPublic: kahoot?.isPublic,
      createdAt: kahoot?.createdAt,
      updatedAt: kahoot?.updatedAt,
      questions: kahoot?.questions
    })
    .then(() => {
      resetIsKahootFormDirty();
    })
  } catch (err) {
    console.error(err);
  }
}
