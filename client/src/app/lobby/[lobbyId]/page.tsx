'use client'

import Text from "@/app/components/UIComponents/Text";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import axiosInstance from "@/app/utils/axiosConfig";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as signalR from '@microsoft/signalr';
import useInGameStore from "@/app/stores/Kahoot/useInGameStore";
import { Player } from "@/app/interfaces/Play/Player.interface";
import Modal, { ModalTypes } from "@/app/components/utils/Modal/Modal";
import InputForm, { InputFormTypes } from "@/app/components/UIComponents/InputForm";
import Button, { ButtonSize } from "@/app/components/UIComponents/Button";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import LobbyUserCard from "@/app/components/utils/Lobby/LobbyUserCard";
import Container from "@/app/components/utils/Container";
import { KahootPlay } from "@/app/interfaces/Kahoot/Kahoot.interface";
import Logo, { LogoColors, LogoSize } from "@/app/components/utils/Logo";
import { getDomainName } from "@/app/utils/domainUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const LobbyPage = () => {
  // Routing
  const params = useParams();
  const router = useRouter();

  // Lobby
  let lobbyIdFromParams = Array.isArray(params.lobbyId)
    ? params.lobbyId[0]
    : params.lobbyId;

  // Global store state
  const { signalRConnection, setSignalRConnection, setLobbyId, isHost, setIsHost, currentPlayer, setCurrentPlayer, players, addPlayer, removePlayer, kahoot, setKahootInfo } = useInGameStore();

  // Local component state
  const [isValidLobby, setIsValidLobby] = useState<boolean>(false);
  const [isCustomNickNameModalOpen, setCustomNickNameModalOpen] = useState<boolean>(true);
  const [nickName, setNickName] = useState<string>('');

  useEffect(() => {
    if (lobbyIdFromParams) {
      setLobbyId(lobbyIdFromParams);
      checkIfWeAreInAValidLobby();
    }

    checkIfHost();
  }, []);

  const checkIfWeAreInAValidLobby = () => {
    axiosInstance.post(`/lobby/checkIfValidLobby`, { lobbyId: lobbyIdFromParams })
      .then(res => {
        setIsValidLobby(res.data);
        ConnectingToTheSignalRLobbyHub();
      })
      .catch(err => {
        console.error(err);
      })
  }

  const ConnectingToTheSignalRLobbyHub = () => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5000/hubs/lobbyhub')
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Save the connection details to our store
    setSignalRConnection(connection);
  }

  useEffect(() => {
    startSignalRConnection();
  }, [signalRConnection]);

  const startSignalRConnection = async () => {
    if (signalRConnection) {
      try {
        signalRConnection
          .start()
          .then(async () => {
            setLobbyHubListenerEvents(signalRConnection);
          })
          .then(() => {
            integrateThisGuestConnectionIdToTheLobbyHub();
          })
          .then(() => {
            getAllPlayersFromLobby(signalRConnection);
          })
          .catch(err => {
            console.error(err)
          });
      }
      catch (err) {
        console.error("Error establishing the connection: ", err);
      }
    }
  }

  const integrateThisGuestConnectionIdToTheLobbyHub = () => {
    if (signalRConnection) {
      signalRConnection.invoke("IntegrateGuestToTheLobbyGroup", lobbyIdFromParams);
    }
  }

  const setLobbyHubListenerEvents = (conn: signalR.HubConnection) => {
    conn.on('AddNewPlayer', (newPlayer) => {
      addPlayer({
        id: newPlayer.id,
        name: newPlayer.name,
        earnedPoints: newPlayer.earnedPoints
      });
    })

    conn.on('PlayerHasLeft', (playerId) => {
      removePlayer(playerId);
    })

    conn.on('ReceiveAllPlayers', (allPlayers: any[]) => {
      allPlayers.forEach((player: Player) => {
        addPlayer({
          id: player.id,
          name: player.name,
          earnedPoints: player.earnedPoints
        })
      })
    })

    conn.on('DisconnectPlayer', () => {
      conn.stop();
      router.push('/');
    })

    conn.on('GameHasStarted', () => {
      router.push('/start');
    })

    conn.on('ReceiveAllQuestionsFromHost', (kahootInfo: KahootPlay) => {
      setKahootInfo(kahootInfo);
    })
  }

  const getAllPlayersFromLobby = (signalRConnection: signalR.HubConnection) => {
    if (signalRConnection) {
      signalRConnection.invoke('GetAllPlayersFromLobby', lobbyIdFromParams);
    }
  }

  const downloadAllKahootQuestions = async () => {
    await axiosInstance.get(`/lobby/getKahootTitleAndQuestions?lobbyId=${lobbyIdFromParams}`)
      .then(res => {
        setKahootInfo(res.data);
      })
      .catch(err => {
        console.error(err);
      })
  }

  const checkIfHost = async () => {
    await axiosInstance.get(`/lobby/checkIfTheUserIsHostFromTheGame?lobbyId=${lobbyIdFromParams}`)
      .then(async (res) => {
        setIsHost(res.data.isHost);
        if (res.data.isHost) {
          await downloadAllKahootQuestions();
        }
      })
      .catch(err => {
        console.error(err);
      })
  }

  const createNewPlayer = async () => {
    if (signalRConnection) {
      let newPlayer: Player = {
        id: signalRConnection.connectionId,
        name: nickName,
        earnedPoints: 0
      };

      setCurrentPlayer(newPlayer)

      await putTheUserInTheLobbyQueue(newPlayer);
    }
  }

  const putTheUserInTheLobbyQueue = async (newPlayer: Player) => {
    if (signalRConnection) {
      await signalRConnection.invoke('PutUserInLobbyQueue', lobbyIdFromParams, newPlayer);
    }
  }

  const kickPlayerById = (playerId: string | null | undefined) => {
    if (signalRConnection) {
      signalRConnection.invoke('KickPlayer', lobbyIdFromParams, playerId);
    }
  }

  const startingTheGame = async () => {
    await shareAllQuestionsFromHostToTheOtherClients();
    await setTheGameInProgressMode();
  }

  const shareAllQuestionsFromHostToTheOtherClients = async () => {
    if (signalRConnection) {
      // Once the game has started, the host will share the questions to all the other clients
      await signalRConnection.invoke('ShareQuestionsWithEveryone', kahoot);
    }
  }

  const setTheGameInProgressMode = async () => {
    await axiosInstance.post(`/lobby/startTheGame`, { lobbyId: lobbyIdFromParams })
      .then(res => {
        const hasGameStarted: boolean = res.data;

        if (hasGameStarted) {
          if (signalRConnection) {
            signalRConnection.invoke('StartingGame', lobbyIdFromParams);
          }
        }
      })
      .catch(err => {
        console.error(err);
      })
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

              <Text
                fontWeight={FontWeights.BLACK}
                textColor={TextColors.GRAY}
                useCase={UseCases.HEADER}
                className="text-7xl text-center"
              >
                {lobbyIdFromParams}
              </Text>
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
              {players.length > 1 && isHost && (
                <Button
                  backgroundColor={BackgroundColors.WHITE}
                  fontWeight={FontWeights.BOLD}
                  textColor={TextColors.GRAY}
                  className="text-md"
                  size={ButtonSize.MEDIUM}
                  perspective={false}
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
                key={p.id}
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
          : (currentPlayer.id !== null ? <ScreenForGuest /> : null)}
      </div>

      {/* Modal to be displayed for the user to enter their nickname, so it can be displayed to other users */}
      {!isHost && (
        <Modal
          modalType={ModalTypes.INPUT}
          isOpen={isCustomNickNameModalOpen}
          title={`Welcome!`}
          onClose={() => setCustomNickNameModalOpen(false)}
          bodyContent={(
            <>
              <Text
                fontWeight={FontWeights.REGULAR}
                textColor={TextColors.BLACK}
                useCase={UseCases.LONGTEXT}
                className="text-base"
              >
                Set a custom nickname to join the game!
              </Text>
              <div className="flex flex-col">
                <InputForm
                  type={InputFormTypes.TEXT}
                  textColor={TextColors.BLACK}
                  fontWeight={FontWeights.LIGHT}
                  name="nickName"
                  id="nickName"
                  placeholder="Your new nickname"
                  className="mt-2"
                  value={nickName}
                  onChange={(e: any) => setNickName(e.target.value)}
                />
              </div>
            </>
          )}
          footerContent={(
            <>
              <Button
                backgroundColor={BackgroundColors.BLUE}
                fontWeight={FontWeights.BOLD}
                textColor={TextColors.WHITE}
                className="text-sm"
                size={ButtonSize.MEDIUM}
                onClick={() => {
                  createNewPlayer();
                  setCustomNickNameModalOpen(false);
                }}
              >
                Save nickname
              </Button>
            </>
          )}
        />
      )}
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
            onClick={() => router.push('/')}
          >
            Go to homepage
          </Button>
        </div>
      </div>
    </div>
  )
};

export default LobbyPage;
