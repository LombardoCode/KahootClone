import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import Button, { ButtonRoundness, ButtonSize } from "../../UIComponents/Button";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";

interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalOfResults: number;
  setSelectedPage: (selectedPage: number) => void;
}

const Pagination = ({ currentPage, pageSize, totalOfResults, setSelectedPage }: PaginationProps) => {
  const totalOfPages: number = Math.max(1, Math.ceil(totalOfResults / pageSize));
  const maxNumOfPagesToShow: number = 10;
  const halfBefore: number = 5;

  let start: number = currentPage <= halfBefore ? 1 : currentPage - halfBefore;
  let end: number = start + maxNumOfPagesToShow - 1;

  if (end > totalOfPages) {
    end = totalOfPages;
    start = Math.max(1, end - maxNumOfPagesToShow);
  }

  const totalOfPagesToDisplay: number[] = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  const canGoBack: boolean = currentPage > 1;
  const canGoForward: boolean = currentPage < totalOfPages;

  return (
    <div
      id="pagination"
      className="flex select-none"
    >
      {totalOfPages > maxNumOfPagesToShow && (
        <Button
          backgroundColor={BackgroundColors.PURPLE}
          fontWeight={FontWeights.BOLD}
          textColor={TextColors.WHITE}
          animateOnHover={false}
          size={ButtonSize.EXTRA_SMALL}
          roundness={ButtonRoundness.FULL}
          onClick={() => canGoBack && setSelectedPage(currentPage - 1)}
          className={`mr-1 px-5 py-3 ${!canGoBack && 'opacity-45'}`}
        >
          <FontAwesomeIcon
            icon={faAngleLeft}
            className={`${TextColors.WHITE} rotate-0`}
          />
        </Button>
      )}

      {totalOfPagesToDisplay.map((numberOfPage: number) => (
        <PaginationPageButton
          index={numberOfPage}
          numberToDisplay={numberOfPage}
          currentPage={currentPage}
          selectPage={setSelectedPage}
        />
      ))}

      {totalOfPages > maxNumOfPagesToShow && (
        <Button
          backgroundColor={BackgroundColors.PURPLE}
          fontWeight={FontWeights.BOLD}
          textColor={TextColors.WHITE}
          animateOnHover={false}
          size={ButtonSize.EXTRA_SMALL}
          roundness={ButtonRoundness.FULL}
          onClick={() => canGoForward && setSelectedPage(currentPage + 1)}
          className={`ml-1 px-5 py-3 ${!canGoForward && 'opacity-45'}`}
        >
          <FontAwesomeIcon
            icon={faAngleLeft}
            className={`${TextColors.WHITE} rotate-180`}
          />
        </Button>
      )}
    </div>
  )
}

interface PaginationPageButtonProps {
  index: number;
  numberToDisplay: number;
  currentPage: number;
  selectPage: (selectedPage: number) => void;
}

const PaginationPageButton = ({ index, numberToDisplay, currentPage, selectPage }: PaginationPageButtonProps) => {
  const selected: boolean = index === currentPage;
  
  return (
    <Button
      fontWeight={FontWeights.BOLD}
      textColor={selected ? TextColors.WHITE : TextColors.PURPLE_VARIANT_4}
      animateOnHover={false}
      size={ButtonSize.EXTRA_SMALL}
      className={`px-5 py-3 rounded-md mx-1 cursor-pointer ${selected ? 'bg-kahoot-purple-variant-4' : 'border-2 border-kahoot-purple-variant-4'}`}
      // className={`px-5 py-3 rounded-md mx-1 cursor-pointer ${selected ? 'bg-kahoot-purple-variant-4' : 'bg-kahoot-purple-variant-2 hover:bg-kahoot-purple-variant-4'}`}
      onClick={() => selectPage(numberToDisplay)}
    >
      {numberToDisplay}
    </Button>
  )
}

export default Pagination;
