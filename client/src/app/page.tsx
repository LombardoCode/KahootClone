import Image from "next/image";
import Input from "./components/UIComponents/Input";
import Button, { BackgroundColors } from "./components/UIComponents/Button";
import Text, { TextColors, TextTypographies } from "./components/UIComponents/Text";
import Link from "next/link";

const Home = () => {
  return (
    <div className="bg-violet-950 w-full h-screen">
      <div className="background-shapes absolute w-full h-screen overflow-hidden">
        <div className="absolute background-shape-square w-96 h-96 bg-black rotate-45 scale-200 opacity-15"></div>
        <div className="absolute background-shape-circle w-96 h-96 bg-black right-0 top-full -translate-y-96 scale-200 opacity-15 rounded-full"></div>
      </div>
      <div className="flex flex-col h-full">
        <div className="flex flex-1 justify-center items-center flex-col relative z-10">
          <Image
            src={"/Kahoot_Logo.svg"}
            alt={"Kahoot logo"}
            width={200}
            height={100}
            className="mb-4"
          />
          <div className="flex flex-col justify-between bg-black px-4 py-3 rounded-sm h-36">
            <Input
              placeholder="Game PIN"
            />
            <Button
              textContent="Enter"
              backgroundColor={BackgroundColors.GRAY}
            />
          </div>
        </div>
        <footer className="text-center relative z-10 py-5">
          <Text
            textColor={TextColors.WHITE}
            fontStyle={TextTypographies.REGULAR}
          >
            Create your own Kahoot account for FREE by clicking <Link href="/signup">here</Link>!
          </Text>
        </footer>
      </div>
    </div>
  );
}

export default Home;
