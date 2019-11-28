const path = require(`path`)

const config = require(`./src/utils/siteConfig`)
const generateRSSFeed = require(`./src/utils/rss/generate-feed`)
/**
 * This is the place where you can tell Gatsby which plugins to use
 * and set them up the way you want.
 *
 * Further info 👉🏼 https://www.gatsbyjs.org/docs/gatsby-config/
 *
 */
const gatsbyConfig =  {
    siteMetadata: {
        siteUrl: config.siteUrl,
        title: config.siteTitleMeta,
        description: config.siteDescriptionMeta,
    },
    mapping: {
        "MarkdownRemark.frontmatter.tags": `MarkdownRemark.frontmatter.tag_id`,
        "MarkdownRemark.frontmatter.author": `MarkdownRemark.frontmatter.author_id`,
    },
    plugins: [
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: path.join(__dirname, `src`, `posts`),
                name: `posts`,
            },
        },
        `gatsby-plugin-sharp`,
        `gatsby-transformer-sharp`,
        {
            resolve: `gatsby-transformer-remark`,
            options: {
                plugins: [
                    {
                        resolve: `gatsby-remark-images`,
                        options: {
                            maxWidth: 740,
                            quality: 90,
                            withWebp: true,
                        },
                    },
                    {
                        resolve: `gatsby-remark-prismjs`,
                        options: {
                            classPrefix: `language-`,
                            inlineCodeMarker: null,
                            aliases: {},
                            showLineNumbers: false,
                            noInlineHighlight: false,
                        },
                    },
                    {
                        resolve: `gatsby-remark-external-links`,
                        options: {
                            target: `_blank`,
                            rel: null,
                        },
                    },
                ],
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: path.join(__dirname, `src`, `tags`),
                name: `tags`,
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: path.join(__dirname, `src`, `authors`),
                name: `authors`,
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: path.join(__dirname, `src`, `pages`),
                name: `pages`,
            },
        },
        `gatsby-plugin-react-helmet`,
        `gatsby-plugin-force-trailing-slashes`,

    ]
}
if (process.env.NODE_ENV === `production`) {
    const plugins = [{
        resolve: `gatsby-plugin-google-analytics`,
        options: {
            trackingId: config.googleAnalyticsId,
        }
    },
        {
            resolve: `gatsby-plugin-ghost-manifest`,
            options: {
                short_name: config.shortTitle,
                start_url: `/`,
                background_color: config.backgroundColor,
                theme_color: config.themeColor,
                display: `minimal-ui`,
                icon: `static/${config.siteIcon}`,
                name: config.siteTitleMeta,
                description: config.siteDescriptionMeta,
            },
        },
        {
            resolve: `gatsby-plugin-feed`,
            options: {
                query: `
                {
                    site {
                      siteMetadata {
                        title
                        description
                        siteUrl
                        site_url: siteUrl
                      }
                    }
                  }
              `,
                feeds: [generateRSSFeed(config)],
            },
        },
        {
            resolve: `gatsby-plugin-advanced-sitemap`,
            options: {
                query: `
                {
                    allPosts: allMarkdownRemark(filter: {fileAbsolutePath: {regex: "/posts/"}}) {
                      edges: nodes {
                        node: frontmatter {
                          slug
                          updated_at
                          id:slug
                        }
                      }
                    }
                    allAuthors: allMarkdownRemark(filter: {fileAbsolutePath: {regex: "/authors/"}}) {
                      edges: nodes {
                        id
                        node: frontmatter {
                          slug
                          updated_at
                          id:slug
                        }
                      }
                    }
                    allTags: allMarkdownRemark(filter: {fileAbsolutePath: {regex: "/tags/"}}) {
                      edges: nodes {
                        id
                        node: frontmatter {
                          slug
                          updated_at
                          id:slug
                        }
                      }
                    },
                    allPages: allMarkdownRemark(filter: {fileAbsolutePath: {regex: "/pages/"}}) {
                      edges: nodes {
                        id
                        node: frontmatter {
                          slug
                          updated_at
                          id:slug
                        }
                      }
                    }
                  }
                  `,
                mapping: {
                    allPosts: {
                        sitemap: `posts`,
                    },
                    allAuthors: {
                        sitemap: `authors`,
                    },
                    allTags: {
                        sitemap: `tags`,
                    },
                    allPages: {
                        sitemap: `pages`
                    }
                },
                exclude: [
                    `/dev-404-page`,
                    `/404`,
                    `/404.html`,
                    `/offline-plugin-app-shell-fallback`,
                ],
                createLinkInHead: true,
            },
        },]

    // adding plugins
    gatsbyConfig.plugins = gatsbyConfig.plugins.concat(plugins)
}
module.exports = gatsbyConfig;
