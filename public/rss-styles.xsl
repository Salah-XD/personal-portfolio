<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes" doctype-system="about:legacy-compat" />

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
        <title><xsl:value-of select="/rss/channel/title" /> — RSS Feed</title>
        <style>
          :root {
            color-scheme: light dark;
            --bg: #f8fafc;
            --panel: #ffffff;
            --border: #e2e8f0;
            --fg: #0f172a;
            --muted: #475569;
            --accent: #0f766e;
            --accent-strong: #115e59;
            --tag-bg: #f1f5f9;
            --tag-fg: #334155;
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --bg: #020617;
              --panel: #0f172a;
              --border: #1e293b;
              --fg: #e2e8f0;
              --muted: #94a3b8;
              --accent: #34d399;
              --accent-strong: #6ee7b7;
              --tag-bg: #1e293b;
              --tag-fg: #cbd5e1;
            }
          }
          * { box-sizing: border-box; }
          html, body { margin: 0; padding: 0; }
          body {
            font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
            background: var(--bg);
            color: var(--fg);
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
          }
          .wrap { max-width: 760px; margin: 0 auto; padding: 2.5rem 1.25rem 4rem; }
          .banner {
            border: 1px solid var(--border);
            background: var(--panel);
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 2rem;
          }
          .prompt { color: var(--accent); font-size: 0.8rem; margin-bottom: 0.5rem; }
          .banner h1 { font-size: 1.4rem; margin: 0 0 0.5rem; }
          .banner p { margin: 0 0 1rem; color: var(--muted); font-size: 0.9rem; }
          .hint {
            font-size: 0.75rem;
            color: var(--muted);
            background: var(--tag-bg);
            border: 1px dashed var(--border);
            border-radius: 8px;
            padding: 0.65rem 0.85rem;
            margin: 0;
          }
          .hint code {
            color: var(--accent);
            background: transparent;
            padding: 0;
          }
          .meta {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            font-size: 0.75rem;
            color: var(--muted);
            margin-top: 0.75rem;
          }
          .meta a { color: var(--accent); text-decoration: none; }
          .meta a:hover { color: var(--accent-strong); text-decoration: underline; }
          h2.section {
            font-size: 0.85rem;
            color: var(--muted);
            text-transform: uppercase;
            letter-spacing: 0.08em;
            margin: 2rem 0 1rem;
            font-weight: 500;
          }
          ol.items { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.75rem; }
          li.item {
            border: 1px solid var(--border);
            background: var(--panel);
            border-radius: 10px;
            padding: 1rem 1.25rem;
            transition: border-color 0.15s ease, transform 0.15s ease;
          }
          li.item:hover { border-color: var(--accent); transform: translateY(-1px); }
          .item-title {
            display: block;
            font-size: 1rem;
            font-weight: 600;
            color: var(--fg);
            text-decoration: none;
            margin-bottom: 0.35rem;
          }
          .item-title:hover { color: var(--accent-strong); }
          .item-meta {
            font-size: 0.72rem;
            color: var(--muted);
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem 1rem;
            margin-bottom: 0.5rem;
          }
          .item-desc {
            font-size: 0.85rem;
            color: var(--muted);
            margin: 0 0 0.6rem;
          }
          .tags { display: flex; flex-wrap: wrap; gap: 0.35rem; }
          .tag {
            font-size: 0.7rem;
            background: var(--tag-bg);
            color: var(--tag-fg);
            border-radius: 999px;
            padding: 0.15rem 0.6rem;
          }
          footer.foot {
            margin-top: 3rem;
            padding-top: 1.25rem;
            border-top: 1px solid var(--border);
            font-size: 0.75rem;
            color: var(--muted);
            text-align: center;
          }
          footer.foot a { color: var(--accent); text-decoration: none; }
          footer.foot a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <main class="wrap">
          <section class="banner">
            <div class="prompt">salah@portfolio:~$ cat /rss.xml</div>
            <h1><xsl:value-of select="/rss/channel/title" /></h1>
            <p><xsl:value-of select="/rss/channel/description" /></p>
            <p class="hint">
              This is an RSS feed. Subscribe by pasting the URL into a feed reader
              like <strong>Feedly</strong>, <strong>NetNewsWire</strong>, or <strong>daily.dev</strong>.
              New posts arrive automatically — no email required.
            </p>
            <div class="meta">
              <span>
                <a>
                  <xsl:attribute name="href"><xsl:value-of select="/rss/channel/link" /></xsl:attribute>
                  ← back to site
                </a>
              </span>
              <span>
                <xsl:value-of select="count(/rss/channel/item)" /> posts
              </span>
            </div>
          </section>

          <h2 class="section">// recent posts</h2>
          <ol class="items">
            <xsl:for-each select="/rss/channel/item">
              <li class="item">
                <a class="item-title">
                  <xsl:attribute name="href"><xsl:value-of select="link" /></xsl:attribute>
                  <xsl:value-of select="title" />
                </a>
                <div class="item-meta">
                  <span>
                    <xsl:value-of select="substring(pubDate, 1, 16)" />
                  </span>
                  <xsl:if test="author">
                    <span>· <xsl:value-of select="author" /></span>
                  </xsl:if>
                </div>
                <xsl:if test="description">
                  <p class="item-desc"><xsl:value-of select="description" /></p>
                </xsl:if>
                <xsl:if test="category">
                  <div class="tags">
                    <xsl:for-each select="category">
                      <span class="tag"><xsl:value-of select="." /></span>
                    </xsl:for-each>
                  </div>
                </xsl:if>
              </li>
            </xsl:for-each>
          </ol>

          <footer class="foot">
            <p>
              Generated by <a href="https://docs.astro.build/en/guides/rss/">@astrojs/rss</a>
              · <a><xsl:attribute name="href"><xsl:value-of select="/rss/channel/link" /></xsl:attribute>salahxd.dev</a>
            </p>
          </footer>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
