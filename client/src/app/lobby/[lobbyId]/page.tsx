'use client'

import Text from "@/app/components/UIComponents/Text";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import axiosInstance from "@/app/utils/axiosConfig";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useInGameStore from "@/app/stores/Kahoot/useInGameStore";
import { Player } from "@/app/interfaces/Play/Player.interface";
import Button, { ButtonSize, PerspectiveSize } from "@/app/components/UIComponents/Button";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import LobbyUserCard from "@/app/components/utils/Lobby/LobbyUserCard";
import Container from "@/app/components/utils/Container";
import Logo, { LogoColors, LogoSize } from "@/app/components/utils/Logo";
import { getDomainName } from "@/app/utils/domainUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import useLobbySocketEvents from "@/app/hooks/useLobbySocketEvents";
import SoundBank from "@/app/singletons/SoundBank";
import { ROUTES } from "@/app/utils/Routes/routesUtils";
import { integrateConnectionIdToTheLobbyGroup } from "@/app/utils/Lobby/lobbyUtils";
import { HubConnectionState } from "@microsoft/signalr";
import useUserStore from "@/app/stores/useUserStore";
import { useUserData } from "@/app/hooks/useUserData";
import Tooltip from "@/app/components/UIComponents/ToolTip";
import useBackButtonConfirm from "@/app/hooks/useBackButtonConfirm";

const LobbyPage = () => {
  // Hooks
  useUserData();
  useLobbySocketEvents();
  useBackButtonConfirm();

  // Global store state
  const { signalRConnection, lobbyId, isHost, currentPlayer, players, kahoot, setKahoot } = useInGameStore();
  const { user, isUserLoaded } = useUserStore();

  // Local component state
  const router = useRouter();
  const [isValidLobby, setIsValidLobby] = useState<boolean>(false);
  const [wasTheStartButtonClicked, setWasTheStartButtonClicked] = useState<boolean>(false);
  const [wasLobbyIdCopiedToClipboard, setWasLobbyIdCopiedToClipboard] = useState<boolean>(false);


  const ready: boolean =
    signalRConnection !== null &&
    isHost !== null &&
    lobbyId !== null &&
    (isHost === true || (isHost === false && currentPlayer !== null));

  useEffect(() => {
    if (!isUserLoaded) {
      return;
    }

    if (!ready) {
      user.userName !== null
        ? router.push(ROUTES.MENU.DISCOVER)
        : router.push(ROUTES.ROOT);

      return;
    }

    const initialization = async () => {
      if (isHost === false) {
        await signalRConnection!.invoke('PutGuestInLobbyQueue', lobbyId, currentPlayer);
      }

      await integrateConnectionIdToTheLobbyGroup(signalRConnection!, lobbyId, isHost);

      await checkIfWeAreInAValidLobby();
    }

    initialization();
  }, [ready, isUserLoaded, user.userName]);

  useEffect(() => {
    if (!wasLobbyIdCopiedToClipboard) {
      return;
    }

    const timeout = setTimeout(() => {
      setWasLobbyIdCopiedToClipboard(false);
    }, 2500);

    return () => {
      clearTimeout(timeout);
    }
  }, [wasLobbyIdCopiedToClipboard]);

  const checkIfWeAreInAValidLobby = async () => {
    await axiosInstance.post(`/lobby/checkIfValidLobby`, { lobbyId })
      .then(res => {
        setIsValidLobby(res.data);
        if (isHost) {
          putHostToDownloadKahoot();
          SoundBank.preloadAllInGameMusicAndSoundFX();
        }
      })
      .catch(err => {
        console.error(err);
      })
  }

  const putHostToDownloadKahoot = async () => {
    if (!isHost) {
      return;
    }

    await downloadAllKahootQuestions();
  }

  const downloadAllKahootQuestions = async () => {
    await axiosInstance.get(`/lobby/getKahootTitleAndQuestions?lobbyId=${lobbyId}`)
      .then(res => {
        setKahoot(res.data);
      })
      .catch(err => {
        console.error(err);
      })
  }

  const kickPlayerById = (playerId: string | null | undefined) => {
    if (lobbyId === null || playerId === null) {
      return;
    }

    if (signalRConnection !== null && signalRConnection.state === HubConnectionState.Connected) {
      signalRConnection.invoke('KickPlayer', lobbyId.toString(), playerId);
    }
  }

  const startingTheGame = async () => {
    if (!wasTheStartButtonClicked) {
      setWasTheStartButtonClicked(true);
      await shareAllQuestionsFromHostToTheOtherClients();
      await setTheGameInProgressMode();
    }
  }

  const shareAllQuestionsFromHostToTheOtherClients = async () => {
    if (signalRConnection !== null && signalRConnection.state === HubConnectionState.Connected) {
      // Once the game has started, the host will share the questions to all the other clients
      await signalRConnection.invoke('ShareQuestionsWithEveryone', kahoot);
    }
  }

  const setTheGameInProgressMode = async () => {
    await axiosInstance.post(`/lobby/startTheGame`, { lobbyId })
      .then(res => {
        const hasGameStarted: boolean = res.data;

        if (hasGameStarted && signalRConnection !== null && signalRConnection.state === HubConnectionState.Connected) {
          signalRConnection.invoke('StartingGame', lobbyId);
        }
      })
      .catch(err => {
        console.error(err);
      })
  }

  const sendGamePINToClipboard = async () => {
    if (lobbyId === null) {
      return;
    }
    
    const url: URL = new URL(process.env.NEXT_PUBLIC_CLIENT_URL + ROUTES.ROOT);
    url.searchParams.set("pin", lobbyId);
    const urlToCopy: string = url.toString();

    await navigator.clipboard.writeText(urlToCopy)
      .then(() => {
        setWasLobbyIdCopiedToClipboard(true);
      });
  }

  if (!isUserLoaded) {
    return null;
  }

  if (!ready) {
    return null;
  }

  if (!isValidLobby) {
    return (
      <LobbyIsNotValidPage />
    )
  }

  const ScreenForHost = () => {
    return (
      <>
        <div className="flex justify-center">
          <div id="invitation-and-game-pin-header" className="grid grid-cols-5 gap-2 py-8">
            <div id="invitation-header" className="col-span-3 flex flex-col justify-center items-center bg-white rounded-md px-8 py-3 shadow-lg shadow-black/20">
              <Text
                fontWeight={FontWeights.REGULAR}
                textColor={TextColors.GRAY}
                useCase={UseCases.HEADER}
                className="text-2xl text-center w-8/12"
              >
                Join at{" "}
                <Text
                  fontWeight={FontWeights.BOLD}
                  textColor={TextColors.GRAY}
                  useCase={UseCases.INLINE}
                >
                  {getDomainName()}
                </Text>
                {" "}to play
              </Text>
            </div>

            <div id="game-pin-header" className="col-span-2 flex flex-col justify-center bg-white rounded-md px-8 pt-2 pb-6 shadow-lg shadow-black/20">
              <Text
                fontWeight={FontWeights.BOLD}
                textColor={TextColors.GRAY}
                useCase={UseCases.HEADER}
                className="text-2xl mt-2 text-left"
              >
                Game PIN
              </Text>

              <div className="relative group">
                <Text
                  fontWeight={FontWeights.BLACK}
                  textColor={TextColors.GRAY}
                  useCase={UseCases.HEADER}
                  className="text-7xl text-center hover:bg-zinc-300 px-3 py-2 cursor-pointer"
                  onClick={sendGamePINToClipboard}
                >
                  {lobbyId}
                </Text>

                <Tooltip text={!wasLobbyIdCopiedToClipboard ? 'Copy Game PIN to share' : 'Game PIN copied!'} />
              </div>
            </div>
          </div>
        </div>

        <Container>
          <div id="lobby-kahoot-logo-and-host-buttons" className="relative flex justify-center items-center">
            <div id="lobby-kahoot-logo">
              <Logo
                size={LogoSize.SMALL}
                color={LogoColors.WHITE}
              />
            </div>

            <div id="lobby-host-buttons" className="absolute right-0">
              {players.length > 0 && isHost && (
                <Button
                  backgroundColor={BackgroundColors.WHITE}
                  fontWeight={FontWeights.BOLD}
                  textColor={TextColors.GRAY}
                  className={`text-md select-none ${!wasTheStartButtonClicked ? 'opacity-100' : 'opacity-45'}`}
                  size={ButtonSize.MEDIUM}
                  perspective={PerspectiveSize.MEDIUM}
                  animateOnHover={false}
                  onClick={() => startingTheGame()}
                >
                  Start game
                </Button>
              )}
            </div>
          </div>
        </Container>

        <Container>
          <div id="list-for-players" className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-10">
            {players.map((p: Player) => (
              <LobbyUserCard
                key={p.connectionId}
                player={p}
                kickPlayer={kickPlayerById}
              />
            ))}
          </div>
        </Container>
      </>
    )
  }

  const ScreenForGuest = () => {
    if (currentPlayer === null) {
      return null;
    }

    return (
      <div className="flex justify-center items-center h-full">
        <div id="guest-player-card-information" className="flex flex-col items-center">
          <div id="guest-player-card-information-icon" className="flex justify-center items-center w-24 h-24 bg-purple-900 rounded-full mb-2">
            <FontAwesomeIcon
              icon={faUser}
              size={"3x"}
              color="#FFFFFF"
            />
          </div>

          <div id="guest-player-card-information-name" className="mb-3">
            <Text
              textColor={TextColors.WHITE}
              useCase={UseCases.LONGTEXT}
              fontWeight={FontWeights.BOLD}
              className="text-2xl text-shadow shadow-black/80"
            >
              {currentPlayer.name}
            </Text>
          </div>

          <div id="guest-player-card-information-join-info">
            <Text
              textColor={TextColors.WHITE}
              useCase={UseCases.LONGTEXT}
              fontWeight={FontWeights.BOLD}
              className="text-sm text-shadow shadow-black/80"
            >
              You have joined! Can you see your name in the screen?
            </Text>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative bg-creator-classroom bg-center bg-cover bg-no-repeat h-screen overflow-hidden`}>
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="relative z-10 h-full">
        {isHost
          ? <ScreenForHost />
          : (currentPlayer !== null ? <ScreenForGuest /> : null)}
      </div>
    </div>
  )
}

const LobbyIsNotValidPage = () => {
  const router = useRouter();

  return (
    <div className="bg-violet-950 h-screen flex justify-center items-center">
      <div id="lobby-not-valid-dialog" className="bg-white px-5 py-6 rounded-md min-w-max">
        <Text
          fontWeight={FontWeights.BOLD}
          textColor={TextColors.BLACK}
          useCase={UseCases.LONGTEXT}
          className="text-3xl mb-1"
        >
          Sorry!
        </Text>
        <Text
          fontWeight={FontWeights.REGULAR}
          textColor={TextColors.BLACK}
          useCase={UseCases.LONGTEXT}
          className="text-lg"
        >
          The lobby is not valid or does not exist.
        </Text>

        <div id="go-back-to-homepage-button" className="text-center mt-2">
          <Button
            backgroundColor={BackgroundColors.GREEN}
            fontWeight={FontWeights.BOLD}
            textColor={TextColors.WHITE}
            className="text-sm"
            size={ButtonSize.MEDIUM}
            onClick={() => router.push(ROUTES.ROOT)}
          >
            Go to homepage
          </Button>
        </div>
      </div>
    </div>
  )
};

export default LobbyPage;
