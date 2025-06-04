import '@fontsource/poppins'; // Tambahkan ini
import './globals.css';

export const metadata = {
  title: 'OCR Web App',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
