import MainHeader from "@/components/mobile/Header/MainHeader";

export default function BellServiceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <MainHeader />
      {children}
    </>
  );
}
