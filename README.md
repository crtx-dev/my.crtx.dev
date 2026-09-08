# my.crtx.dev

Browser-local launcher for Cortex. Visiting `/` opens the saved Cortex host and port (`localhost:7331` by default); visiting `/?config` displays the host and port configuration form. Hosts without a scheme use HTTP for localhost and IP addresses, and HTTPS for domain names. An explicit `http://` or `https://` scheme is preserved.

## Build

```sh
nift build
```

Serve `public/` with any static web server. GitHub Pages should be configured with the custom domain `my.crtx.dev` and HTTPS enabled.
