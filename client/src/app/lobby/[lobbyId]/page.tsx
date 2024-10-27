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
    }

    axiosInstance.post(`/lobby/checkIfValidLobby`, { lobbyId: lobbyIdFromParams })
      .then(res => {
        console.log(res.data);
        setIsValidLobby(res.data);
      })
      .catch(err => {
        console.error(err);
      })

    const connection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5000/hubs/lobbyhub')
      .configureLogging(signalR.LogLevel.Information)
      .build();

    setSignalRConnection(connection)
  }, []);

  useEffect(() => {
    const startSignalRConnection = async () => {
      if (signalRConnection) {
        try {
          signalRConnection
            .start()
            .then(async () => {
              signalRConnection.on('AddNewPlayer', (newPlayer) => {
                addPlayer({
                  id: newPlayer.id,
                  name: newPlayer.name
                });
              })

              signalRConnection.on('PlayerHasLeft', (playerId) => {
                removePlayer(playerId);
              })

              signalRConnection.on('ReceiveAllPlayers', (allPlayers: any[]) => {
                allPlayers.forEach((player: Player) => {
                  addPlayer({
                    id: player.id,
                    name: player.name
                  })
                })
              })

              signalRConnection.on('DisconnectPlayer', () => {
                signalRConnection.stop();
                router.push('/');
              })

              signalRConnection.on('GameHasStarted', () => {
                router.push('/start');
              })

              signalRConnection.on('ReceiveAllQuestionsFromHost', (kahootInfo: KahootPlay) => {
                setKahootInfo(kahootInfo);
              })
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

    startSignalRConnection();

    checkIfHost();
  }, [signalRConnection]);

  const downloadAllKahootQuestions = async () => {
    console.log("downloading questions")
    await axiosInstance.get(`/lobby/getKahootTitleAndQuestions?lobbyId=${lobbyIdFromParams}`)
      .then(res => {
        console.log(res.data);
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
        await downloadAllKahootQuestions();
      })
      .catch(err => {
        console.error(err);
      })
  }

  const createNewPlayer = async () => {
    if (signalRConnection) {
      let newPlayer: Player = {
        id: signalRConnection.connectionId,
        name: nickName
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

  return (
    <div>
      <div id="header" className="flex flex-col items-center py-8">
        <Text
          fontWeight={FontWeights.REGULAR}
          textColor={TextColors.BLACK}
          useCase={UseCases.HEADER}
          className="text-4xl"
        >
          Join at <span className="fnt-montserrat-bold">KahootClone</span> with Game PIN:
        </Text>
        <Text
          fontWeight={FontWeights.BOLD}
          textColor={TextColors.BLACK}
          useCase={UseCases.HEADER}
          className="text-4xl mt-2"
        >
          {lobbyIdFromParams}
        </Text>
      </div>

      <Container>
        <div id="play-button" className="flex justify-end">
          {players.length > 1 && isHost && (
            <Button
              backgroundColor={BackgroundColors.GREEN}
              fontWeight={FontWeights.BOLD}
              textColor={TextColors.WHITE}
              className="text-sm"
              size={ButtonSize.MEDIUM}
              onClick={() => startingTheGame()}
            >
              Start game
            </Button>
          )}
        </div>
      </Container>

      <p>{JSON.stringify(kahoot)}</p>

      <div id="who-are-you" className="text-green-600 mb-10">
        <p>You are:</p>
        <p>{currentPlayer.name}</p>
      </div>

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

      <div>
        {isHost
          ? (
            <div>Is the host</div>
          )
          : (
            <div>Guest</div>
          )}
      </div>

      {/* Modal to be displayed for the user to enter their nickname, so it can be displayed to other users */}
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
