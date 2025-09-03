import DashboardLayout from "../menu/layout";

interface AccountLayoutPageProps {
  children: React.ReactNode;
}

const AccountLayoutPage = ({ children }: AccountLayoutPageProps) => {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  )
}

export default AccountLayoutPage;
