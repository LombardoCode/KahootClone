import useKahootCreatorStore from "../stores/Kahoot/useKahootCreatorStore";

export const doesThisQuestionHasAnImage = (questionIndex: number): boolean => {
  const { kahoot } = useKahootCreatorStore(); 

  if (kahoot && kahoot.questions[questionIndex]) {
    const mediaUrl = kahoot?.questions[questionIndex].mediaUrl;
    const doesThisQuestionHasAnImage: boolean = mediaUrl !== null && mediaUrl !== undefined && mediaUrl !== "";
    return doesThisQuestionHasAnImage;
  }
  
  return false;
}
