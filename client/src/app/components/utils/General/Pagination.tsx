import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import Text from "../../UIComponents/Text";

interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalOfResults: number;
  setSelectedPage: (selectedPage: number) => void;
}

const Pagination = ({ currentPage, pageSize, totalOfResults, setSelectedPage }: PaginationProps) => {
  const totalOfPages: number = Math.ceil(totalOfResults / pageSize);

  return (
    <div
      id="pagination"
      className="flex"
    >
      {Array.from({ length: totalOfPages }).map((_, index: number) => (
        <PaginationPageButton
          index={index}
          numberToDisplay={index}
          currentPage={currentPage}
          selectPage={setSelectedPage}
        />
      ))}
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
  return (
    <div
      className={`px-5 py-3 rounded-md mr-2 cursor-pointer ${index === currentPage ? 'bg-kahoot-purple-variant-4' : 'bg-kahoot-purple-variant-2 hover:bg-kahoot-purple-variant-4'}`}
      onClick={() => selectPage(numberToDisplay)}
    >
      <Text
        fontWeight={FontWeights.BOLD}
        textColor={TextColors.WHITE}
        useCase={UseCases.BODY}
      >
        {numberToDisplay + 1}
      </Text>
    </div>
  )
}

export default Pagination;
