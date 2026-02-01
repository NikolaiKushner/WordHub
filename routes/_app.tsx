import { define } from "../utils.ts";
import Footer from "../components/Footer.tsx";

export default define.page(function App({ Component }) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Getlnk</title>
      </head>
      <body class="flex flex-col min-h-screen">
        <div class="flex-1 flex flex-col">
          <Component />
        </div>
        <Footer />
      </body>
    </html>
  );
});
