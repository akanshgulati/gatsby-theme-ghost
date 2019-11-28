const cheerio = require(`cheerio`)
const tagsHelper = require(`@tryghost/helpers`).tags
const _ = require(`lodash`)
const generateItem = function generateItem(site, post) {
    const siteConfig = site.siteMetadata;
    const itemUrl = post.frontmatter.slug;
    const html = post.html
    const htmlContent = cheerio.load(html, { decodeEntities: false, xmlMode: true })
    const item = {
        title: post.frontmatter.title,
        description: post.excerpt,
        guid: post.frontmatter.id,
        url: itemUrl,
        date: post.frontmatter.published_at,
        author: post.frontmatter.author && post.frontmatter.author.frontmatter ? post.frontmatter.author.frontmatter.name : null,
        custom_elements: [],
    }
    let imageUrl

    if (post.frontmatter.feature_image && post.frontmatter.feature_image.childImageSharp.fluid.originalImg) {
        imageUrl = siteConfig.siteUrl + post.frontmatter.feature_image.childImageSharp.fluid.originalImg

        // Add a media content tag
        item.custom_elements.push({
            'media:content': {
                _attr: {
                    url: imageUrl,
                    medium: `image`,
                },
            },
        })

        // Also add the image to the content, because not all readers support media:content
        htmlContent(`p`).first().before(`<img src="` + imageUrl + `" />`)
        htmlContent(`img`).attr(`alt`, post.title)
    }

    item.custom_elements.push({
        'content:encoded': {
            _cdata: htmlContent.html(),
        },
    })
    return item
}

const generateRSSFeed = function generateRSSFeed(site) {
    return {
        serialize: ({ query: { site, allMarkdownRemark } }) => allMarkdownRemark.edges.map(edge => Object.assign({}, generateItem(site, edge.node))),
        setup: ({ query: { site } }) => {
            const siteConfig = site.siteMetadata;
            const siteTitle = site.siteMetadata.title || `No Title`
            const siteDescription = site.siteMetadata.description || `No Description`
            const feed = {
                title: siteTitle,
                description: siteDescription,
                generator: `Ghost 2.9`,
                feed_url: `${siteConfig.siteUrl}/rss/`,
                site_url: `${siteConfig.siteUrl}/`,
                image_url: `${siteConfig.siteUrl}/${siteConfig.siteIcon}`,
                ttl: `60`,
                custom_namespaces: {
                    content: `http://purl.org/rss/1.0/modules/content/`,
                    media: `http://search.yahoo.com/mrss/`,
                },
            }
            return {
                ...feed,
            }
        },
        query: `
        {
          allMarkdownRemark(filter: {fileAbsolutePath: {regex: "/posts/"}}, sort: {order: DESC, fields: frontmatter___created_at}) {
            edges {
              node {
                id
                frontmatter {
                  title
                  slug
                  featured
                  created_at
                  published_at
                  feature_image {
                    id
                    childImageSharp {
                      fluid {
                        originalImg
                      }
                    }
                  }
                  updated_at
                  meta_title
                  meta_description
                  author {
                    frontmatter {
                      name
                    }
                  }
                  tags {
                    frontmatter {
                      name
                    }
                  }
                }
                html
                excerpt
              }
            }
          }
        }
    `,
        output: `/rss`,
    }
}

module.exports = generateRSSFeed
