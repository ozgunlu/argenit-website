export const metadata = {
  title: "Giriş | Argenit Admin",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-full bg-gray-50">{children}</div>;
}
