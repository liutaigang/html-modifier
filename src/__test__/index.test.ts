import { modifyHtml } from "../../src";

const testHtml = `<html lang="en">
  <head>
    <meta charset="UTF-8">
    <base href="/">
    <link rel="icon" href="/favicon.ico">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vite App</title>
    <script type="module" crossorigin src="/assets/index-5a8420d2.js"></script>
    <link rel="stylesheet" href="/assets/index-9f680dd7.css">
  </head>
  <body>
    <div id="app"></div>
    <!-- webViewInjectIn -->
    
  </body>
</html>`;

describe("htmlModifier", () => {
  test("with blank ModifyHandler", (done) => {
    modifyHtml(testHtml, {})
      .then((newHtml) => {
        expect(newHtml).toEqual(testHtml);
      })
      .finally(() => {
        done();
      });
  });

  test("replace comment with html", (done) => {
    const htmlContent = "<script></script>";
    const modifyDefer = modifyHtml(testHtml, {
      oncomment(data) {
        let content = data;
        if (data.includes("webViewInjectIn")) {
          content = htmlContent;
        }
        return { data: content, clearComment: true };
      },
    });

    modifyDefer
      .then((newHtml) => {
        newHtml.includes(htmlContent);
      })
      .finally(() => {
        done();
      });
  });
});
