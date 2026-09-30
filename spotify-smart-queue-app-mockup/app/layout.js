import "./globals.css";

export const metadata = {
  title: "Smart Queue | Spotify A/B Test Demo",
  description:
    "Portfolio demo: a rudimentary Spotify clone used to demonstrate the Smart Queue A/B test — Product Analyst portfolio project.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
