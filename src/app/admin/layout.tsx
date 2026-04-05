import "../globals.css";

export const metadata = {
  title: "Admin Panel | Argenit",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  );
}
