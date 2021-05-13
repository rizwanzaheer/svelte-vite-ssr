import http from 'http';
import path from 'path';
import serveStatic from 'serve-static';
import render from './server-render';
// @ts-expect-error handle by rollup-plugin-string
import template from './index.html';

const PORT = Number(process.env.PORT) || 3000;

const serve = serveStatic(path.resolve(__dirname, '../client'));

http.createServer(async(req, res) => {
  const url = req.url as string;
  console.log(url);

  if (url.startsWith('/_assets/')) {
    serve(req, res, () => {
      res.statusCode = 404;
      res.end('Not Found');
    });
  } else {
    const { error, status, headers, body } = await render(
      {
        url,
        template,

        ctx: {
          cookies: req.headers.cookie
            ? Object.fromEntries(
              new URLSearchParams(req.headers.cookie.replace(/;\s*/g, '&'))
                // @ts-expect-error Property 'entries' does not exist on type 'URLSearchParams'.ts(2339)
                .entries()
            )
            : {},

          headers: req.headers
        }
      }
    );

    if (error) {
      console.error(error);
    }

    res.writeHead(status, headers);
    res.end(body);
  }
}).listen(PORT);
