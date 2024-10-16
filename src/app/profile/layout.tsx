import Layout from "@/components/mobile/Drawers/Layout";
import MainHeader from "@/components/mobile/Header/MainHeader";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <MainHeader />
      <Layout>{children}</Layout>
    </>
  );
}
