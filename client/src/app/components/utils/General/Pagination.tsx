import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import Button, { ButtonRoundness, ButtonSize } from "../../UIComponents/Button";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import Text from "../../UIComponents/Text";

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
      className="flex justify-between lg:justify-center items-center select-none bg-red-500"
    >
      {totalOfPages > maxNumOfPagesToShow && (
        <LeftButton
          canGoBack={canGoBack}
          currentPage={currentPage}
          setSelectedPage={setSelectedPage}
        />
      )}

      {/* Only visible on Mobile screens */}
      <PaginationPageDisplayerInMobile
        currentPage={currentPage}
        totalOfPages={totalOfPages}
      />


      <div className="hidden lg:flex items-center">
        {totalOfPagesToDisplay.map((numberOfPage: number) => (
          <PaginationPageButton
            index={numberOfPage}
            numberToDisplay={numberOfPage}
            currentPage={currentPage}
            selectPage={setSelectedPage}
            className="hidden lg:block"
          />
        ))}
      </div>


      {totalOfPages > maxNumOfPagesToShow && (
        <RightButton
          canGoForward={canGoForward}
          currentPage={currentPage}
          setSelectedPage={setSelectedPage}
        />
      )}
    </div>
  )
}

interface LeftButtonProps {
  canGoBack: boolean;
  currentPage: number;
  setSelectedPage: (selectedPage: number) => void;
}

const LeftButton = ({ canGoBack, currentPage, setSelectedPage }: LeftButtonProps) => {
  return (
    <Button
      backgroundColor={BackgroundColors.PURPLE}
      fontWeight={FontWeights.BOLD}
      textColor={TextColors.WHITE}
      animateOnHover={false}
      size={ButtonSize.EXTRA_SMALL}
      roundness={ButtonRoundness.FULL}
      onClick={() => canGoBack && setSelectedPage(currentPage - 1)}
      className={`flex justify-center items-center w-16 h-16 lg:w-12 lg:h-12 mr-1 px-5 py-3 ${!canGoBack && 'opacity-45'}`}
    >
      <FontAwesomeIcon
        icon={faAngleLeft}
        size={`2x`}
        className={`${TextColors.WHITE} rotate-0`}
      />
    </Button>
  )
}

interface RightButtonProps {
  canGoForward: boolean;
  currentPage: number;
  setSelectedPage: (selectedPage: number) => void;
}

const RightButton = ({ canGoForward, currentPage, setSelectedPage }: RightButtonProps) => {
  return (
    <Button
      backgroundColor={BackgroundColors.PURPLE}
      fontWeight={FontWeights.BOLD}
      textColor={TextColors.WHITE}
      animateOnHover={false}
      size={ButtonSize.EXTRA_SMALL}
      roundness={ButtonRoundness.FULL}
      onClick={() => canGoForward && setSelectedPage(currentPage + 1)}
      className={`flex justify-center items-center w-16 h-16 lg:w-12 lg:h-12 ml-1 px-5 py-3 ${!canGoForward && 'opacity-45'}`}
    >
      <FontAwesomeIcon
        icon={faAngleLeft}
        size={`2x`}
        className={`${TextColors.WHITE} rotate-180`}
      />
    </Button>
  )
}

interface PaginationPageButtonProps {
  index: number;
  numberToDisplay: number;
  currentPage: number;
  selectPage: (selectedPage: number) => void;
  className?: string;
}

const PaginationPageButton = ({ index, numberToDisplay, currentPage, selectPage, className }: PaginationPageButtonProps) => {
  const selected: boolean = index === currentPage;

  return (
    <Button
      fontWeight={FontWeights.BOLD}
      textColor={selected ? TextColors.WHITE : TextColors.PURPLE_VARIANT_4}
      animateOnHover={false}
      size={ButtonSize.EXTRA_SMALL}
      className={`px-5 py-3 rounded-md mx-1 cursor-pointer ${selected ? 'bg-kahoot-purple-variant-4' : 'border-2 border-kahoot-purple-variant-4'} ${className}`}
      onClick={() => selectPage(numberToDisplay)}
    >
      {numberToDisplay}
    </Button>
  )
}

interface PaginationPageDisplayerInMobileProps {
  currentPage: number;
  totalOfPages: number;
}

const PaginationPageDisplayerInMobile = ({ currentPage, totalOfPages }: PaginationPageDisplayerInMobileProps) => {
  return (
    <Text
      fontWeight={FontWeights.BOLD}
      textColor={TextColors.PURPLE_VARIANT_4}
      useCase={UseCases.BODY}
      className="lg:hidden text-2xl"
    >
      {currentPage} / {totalOfPages}
    </Text>
  )
}

export default Pagination;
