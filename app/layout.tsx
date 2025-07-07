export const metadata = {
  title: "Infinite Tsukuyomi",
  description: "Discover your fantasy self",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}