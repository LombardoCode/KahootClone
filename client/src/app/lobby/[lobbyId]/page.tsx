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

const LobbyPage = () => {
  // Route
  const params = useParams();
  let { lobbyId } = params;
  const router = useRouter();

  // SignalR
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

  // Global store state
  const { isHost, setIsHost, currentPlayer, setCurrentPlayer, players, addPlayer, removePlayer } = useInGameStore();

  // Local component state
  const [isCustomNickNameModalOpen, setCustomNickNameModalOpen] = useState<boolean>(true);
  const [nickName, setNickName] = useState<string>('');

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
        .withUrl('http://localhost:5000/hubs/lobbyhub')
        .configureLogging(signalR.LogLevel.Information)
        .build();

    setConnection(connection)
  }, []);

  useEffect(() => {
    const startSignalRConnection = async () => {
      if (connection) {
        try {
          connection
            .start()
            .then(async () => {
              connection.on('AddNewPlayer', (newPlayer) => {
                addPlayer({
                  id: newPlayer.id,
                  name: newPlayer.name
                });
              })
  
              connection.on('PlayerHasLeft', (playerId) => {
                removePlayer(playerId);
              })

              connection.on('ReceiveAllPlayers', (allPlayers: any[]) => {
                allPlayers.forEach((player: Player) => {
                  addPlayer({
                    id: player.id,
                    name: player.name
                  })
                })
              })

              connection.on('DisconnectPlayer', () => {
                connection.stop();
                router.push('/');
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

    return () => {
      if (connection) {
        connection.stop();
      }
    }
  }, [connection]);

  const checkIfHost = async () => {
    await axiosInstance.get(`/lobby/checkIfTheUserIsHostFromTheGame?lobbyId=${lobbyId}`)
      .then(res => {
        setIsHost(res.data.isHost);
      })
      .catch(err => {
        console.error(err);
      })
  }

  const createNewPlayer = async () => {
    if (connection) {
      let newPlayer: Player = {
        id: connection.connectionId,
        name: nickName
      };
  
      setCurrentPlayer(newPlayer)
  
      await putTheUserInTheLobbyQueue(newPlayer);
    }
  }

  const putTheUserInTheLobbyQueue = async (newPlayer: Player) => {
    if (connection) {
      await connection.invoke('PutUserInLobbyQueue', lobbyId, newPlayer);
    }
  }

  const kickPlayerById = (playerId: string | null | undefined) => {
    if (connection) {
      connection.invoke('KickPlayer', lobbyId, playerId);
    }
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
          {lobbyId}
        </Text>
      </div>

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

export default LobbyPage;
