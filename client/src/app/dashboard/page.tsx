'use client';

import Button from "../components/UIComponents/Button";
import Text from "../components/UIComponents/Text";
import DashboardOutletContainer from "../components/utils/DashboardOutletContainer";
import DashboardOutletNavbar from "../components/utils/DashboardOutletNavbar";
import MainContent from "../components/utils/MainContent";
import SidebarNav from "../components/utils/SidebarNav";
import { BackgroundColors } from "../interfaces/Colors.interface";
import { FontWeights, TextColors, UseCases } from "../interfaces/Text.interface";
import Modal, { ModalTypes } from "../components/utils/Modal/Modal";
import useModalStore from "../stores/useModalStore";
import InputForm, { InputFormTypes } from "../components/UIComponents/InputForm";
import { useState } from "react";
import axiosInstance from "../utils/axiosConfig";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();
  const { isOpen, setIsOpen, closeModal } = useModalStore();
  const [formData, setFormData] = useState({
    newKahootName: ''
  });
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const createKahoot = () => {
    axiosInstance.post('/kahoot/create', { NewKahootName: formData.newKahootName })
      .then(res => {
        router.push(`/creator/${res.data.newKahootId}`);
      })
      .catch((err) => {
        console.error(err)
      })
  }

  return (
    <div className="flex h-screen bg-red-500 overflow-hidden">
      <SidebarNav className="min-w-60 bg-white h-full" />
      <MainContent topSpacing={false} className="flex-1 bg-white overflow-y-scroll">
        <DashboardOutletNavbar />
        <DashboardOutletContainer>
          <Text fontWeight={FontWeights.BOLD} useCase={UseCases.HEADER} textColor={TextColors.BLACK} className="text-3xl">Let&apos;s get started!</Text>
          <Button
            backgroundColor={BackgroundColors.GREEN}
            fontWeight={FontWeights.BOLD}
            onClick={() => setIsOpen(true)}
          >
            Create a Kahoot!
          </Button>
          <Modal
            modalType={ModalTypes.INPUT}
            isOpen={isOpen}
            title={`Create a Kahoot`}
            onClose={closeModal}
            content={(
              <>
                <Text
                  fontWeight={FontWeights.REGULAR}
                  textColor={TextColors.BLACK}
                  useCase={UseCases.LONGTEXT}
                  className="text-base"
                >
                  Enter the name of your new Kahoot
                </Text>
                <InputForm
                  type={InputFormTypes.TEXT}
                  textColor={TextColors.BLACK}
                  fontWeight={FontWeights.LIGHT}
                  name="newKahootName"
                  id="newKahootName"
                  value={formData.newKahootName}
                  onChange={handleFormChange}
                />
              </>
            )}
            confirmText={`Create`}
            onConfirm={() => createKahoot()}
          />
        </DashboardOutletContainer>
      </MainContent>
    </div>
  )
}

export default Dashboard;
