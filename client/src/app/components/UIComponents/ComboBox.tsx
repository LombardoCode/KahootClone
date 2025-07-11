import { FontWeights, TextColors } from "@/app/interfaces/Text.interface";
import montserrat from "@/app/utils/fontsConfig";
import React, { ReactElement, cloneElement, isValidElement, useState } from "react";
import Button, { BorderColors, ButtonSize } from "./Button";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";

interface ComboBoxProps {
  children: React.ReactNode;
  className?: string;
  textContent: string;
  setTextContent: (value: { textContent: string, valueContent: any }) => void;
  textColor: TextColors;
  fontWeight: FontWeights;
}

const ComboBox = ({ children = <></>, textContent = "", className, setTextContent, textColor, fontWeight }: ComboBoxProps) => {
  const [opened, setOpened] = useState<boolean>(false);

  const handleOptionClick = (value: { textContent: string, valueContent: any }) => {
    setTextContent(value);
    setOpened(false);
  }

  return (
    <div className="relative">
      <Button
        backgroundColor={BackgroundColors.WHITE}
        fontWeight={FontWeights.REGULAR}
        textColor={TextColors.BLACK}
        borderColor={BorderColors.GRAY}
        animateOnHover={false}
        size={ButtonSize.SMALL}
        perspective={false}
        className={`${className} ${textColor} ${fontWeight} flex justify-between items-center w-full`}
        onClick={() => setOpened(!opened)}
      >
        <span>{textContent}</span>
        <svg
          className="w-2.5 h-2.5 ms-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </Button>

      {opened && (
        <>
          <div id="dropdown" className={`${montserrat.className} absolute z-10 bg-white ring-1 ring-slate-500 divide-y divide-gray-100 rounded-lg shadow w-full`}>
            <ul className="py-1 text-sm text-gray-700" aria-labelledby="dropdownDefaultButton">
              {React.Children.map(children, (child) => {
                if (isValidElement(child)) {
                  const childElement = child as ReactElement<ComboBoxOptionProps>;
                  return cloneElement(childElement, {
                    onClick: (e: any) => {
                      if (childElement.props.onClick) childElement.props.onClick(e);
                      handleOptionClick({ textContent: childElement.props.textContent, valueContent: childElement.props.valueContent });
                    }
                  });
                }
                return child;
              })}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}

interface ComboBoxOptionProps {
  textContent: string;
  valueContent: any;
  onClick: (e?: any) => void;
}

const ComboBoxOption = ({ textContent = "", valueContent, onClick }: ComboBoxOptionProps) => {
  return (
    <li className="cursor-pointer" onClick={onClick}>
      <span className="block px-4 py-2 hover:bg-gray-500 dark:hover:text-white">
        {textContent}
      </span>
    </li>
  )
}

export interface ComboBoxStateProps {
  textContent: string,
  valueContent: any;
}

export { ComboBox, ComboBoxOption };
