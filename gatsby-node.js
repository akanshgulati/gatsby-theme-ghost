const path = require(`path`)
const config = require(`./src/utils/siteConfig`)
const { paginate } = require(`gatsby-awesome-pagination`)

/**
 * Here is the place where Gatsby creates the URLs for all the
 * posts, tags, pages and authors that we fetched from the Ghost site.
 */
exports.createPages = ({ graphql, actions }) => {
    const { createPage } = actions

    /**
     * Posts
     */
    const createPosts = new Promise((resolve, reject) => {
        const postTemplate = path.resolve(`./src/templates/post.js`)
        const indexTemplate = path.resolve(`./src/templates/index.js`)
        // const tagsTemplate = path.resolve(`./src/templates/tag.js`)
        // console.log("Entered in createposts");
        resolve(
            graphql(`
                {
                    allMarkdownRemark(
                        filter: {
                            frontmatter: { draft: { ne: true } }
                            fileAbsolutePath: { regex: "/posts/" }
                        }
                    ) {
                        edges {
                            node {
                                frontmatter {
                                    slug
                                    tags {
                                        id
                                    }
                                }
                                fileAbsolutePath
                            }
                        }
                    }
                }
            `).then((result) => {
                // eslint-disable-next-line consistent-return
                // console.log("Post Edges->", result);
                if (result.errors) {
                    return reject(result.errors)
                }

                if (!result.data.allMarkdownRemark) {
                    return resolve()
                }
                // console.log("Post Edges->", result.data.allMarkdownRemark);

                const items = result.data.allMarkdownRemark.edges.filter(({node}) => !node.frontmatter.draft);
                // let tags = new Set()

                items.forEach(({ node }) => {
                    // This part here defines, that our posts will use
                    // a `/:slug/` permalink.
                    node.url = `/${node.frontmatter.slug}/`

                    // node.frontmatter.tags.forEach(tag => tags.add(tag))

                    // console.log("Creating Page - url", node.url, "slug", node.frontmatter.slug);

                    createPage({
                        path: node.url,
                        component: path.resolve(postTemplate),
                        context: {
                            // Data passed to context is available
                            // in page queries as GraphQL variables.
                            slug: node.frontmatter.slug,
                        },
                    })
                })

                // Pagination for posts, e.g., /, /page/2, /page/3
                paginate({
                    createPage,
                    items: items,
                    itemsPerPage: config.postsPerPage,
                    component: indexTemplate,
                    pathPrefix: ({ pageNumber }) => {
                        if (pageNumber === 0) {
                            return `/`
                        } else {
                            return `/page`
                        }
                    },
                })
            })
        )
    })

    /**
     * Tags
     */
    const createTags = new Promise((resolve, reject) => {
        const tagsTemplate = path.resolve(`./src/templates/tag.js`)
        resolve(
            graphql(`{
                allMarkdownRemark(
                    filter: {fileAbsolutePath: {regex: "/tags/"}}
                ) {
                  totalCount
                  edges {
                    node {
                      frontmatter {
                        tag_id
                        slug
                        description
                        name
                      }
                    }
                  }
                }
              }`).then((result) => {
                if (result.errors) {
                    return reject(result.errors)
                }

                if (!result.data.allMarkdownRemark) {
                    return resolve()
                }

                // finding all tags available
                const items = result.data.allMarkdownRemark.edges

                const postsPerPage = config.postsPerPage

                items.forEach(async ({ node }) => {
                    // const totalPosts = 1 || node.postCount !== null ? node.postCount : 0
                    const tagSlug = node.frontmatter.slug
                    const totalPostsRemark = await graphql(`
                    {
                        allMarkdownRemark(filter: {frontmatter: {tags: {elemMatch: {frontmatter: {slug: {eq: "${tagSlug}" }}}}}}) {
                          totalCount
                        }
                      }`)

                    const totalPosts = totalPostsRemark.data.allMarkdownRemark.totalCount || 0

                    const numberOfPages = Math.ceil(totalPosts / postsPerPage)

                    // This part here defines, that our tag pages will use
                    // a `/tag/:slug/` permalink.
                    node.frontmatter.url = `/tag/${node.frontmatter.slug}/`

                    Array.from({ length: numberOfPages }).forEach((_, i) => {
                        // console.log("Creating tags started ", i);
                        const currentPage = i + 1
                        const prevPageNumber = currentPage <= 1 ? null : currentPage - 1
                        const nextPageNumber = currentPage + 1 > numberOfPages ? null : currentPage + 1
                        const previousPagePath = prevPageNumber ? prevPageNumber === 1 ? node.url : `${node.frontmatter.url}page/${prevPageNumber}/` : null
                        const nextPagePath = nextPageNumber ? `${node.frontmatter.url}page/${nextPageNumber}/` : null
                        // console.log("Creating tags started ", node.frontmatter.url, node.frontmatter);
                        // console.log("Creating Tag - url", node.frontmatter.url, "slug", node.frontmatter.slug);
                        // console.log("node-> ", node.frontmatter.url);
                        createPage({
                            path:
                                i === 0
                                    ? node.frontmatter
                                        .url
                                    : `${
                                        node
                                            .frontmatter
                                            .url
                                    }page/${i + 1}/`,
                            component: path.resolve(
                                tagsTemplate
                            ),
                            context: {
                                // Data passed to context is available
                                // in page queries as GraphQL variables.
                                slug:
                                node.frontmatter.slug,
                                limit: postsPerPage,
                                skip: i * postsPerPage,
                                numberOfPages: numberOfPages,
                                humanPageNumber: currentPage,
                                prevPageNumber: prevPageNumber,
                                nextPageNumber: nextPageNumber,
                                previousPagePath: previousPagePath,
                                nextPagePath: nextPagePath,
                                tag: node.frontmatter,
                            },
                        })
                    })
                })

                return resolve()
            })
        )
    })

    /**
     * Authors
     */
    const createAuthors = new Promise((resolve, reject) => {
        const authorTemplate = path.resolve(`./src/templates/author.js`)
        resolve(
            graphql(`{
                allMarkdownRemark(filter: {fileAbsolutePath: {regex: "/src/authors/"}}, sort: {order: ASC, fields: frontmatter___name}) {
                  edges {
                    node {
                      id
                      frontmatter {
                        author_id
                        slug
                        profile_image
                        name
                        twitter
                        facebook
                        website
                        description
                      }
                    }
                  }
                }
              }
            `).then((result) => {
                if (result.errors) {
                    return reject(result.errors)
                }

                if (!result.data.allMarkdownRemark) {
                    return resolve()
                }

                const items = result.data.allMarkdownRemark.edges
                const postsPerPage = config.postsPerPage

                items.forEach(({ node }) => {
                    // const totalPosts = node.postCount !== null ? node.postCount : 0
                    const totalPosts = 1
                    const numberOfPages = Math.ceil(totalPosts / postsPerPage)

                    // This part here defines, that our author pages will use
                    // a `/author/:slug/` permalink.
                    node.frontmatter.url = `/author/${node.frontmatter.slug}/`

                    Array.from({ length: numberOfPages }).forEach((_, i) => {
                        const currentPage = i + 1
                        const prevPageNumber = currentPage <= 1 ? null : currentPage - 1
                        const nextPageNumber = currentPage + 1 > numberOfPages ? null : currentPage + 1
                        const previousPagePath = prevPageNumber ? prevPageNumber === 1 ? node.frontmatter.url : `${node.frontmatter.url}page/${prevPageNumber}/` : null
                        const nextPagePath = nextPageNumber ? `${node.frontmatter.url}page/${nextPageNumber}/` : null
                        // console.log("author node -> ", node);
                        createPage({
                            path: i === 0 ? node.frontmatter.url : `${node.frontmatter.url}page/${i + 1}/`,
                            component: path.resolve(authorTemplate),
                            context: {
                                // Data passed to context is available
                                // in page queries as GraphQL variables.
                                slug: node.frontmatter.slug,
                                limit: postsPerPage,
                                skip: i * postsPerPage,
                                numberOfPages: numberOfPages,
                                humanPageNumber: currentPage,
                                prevPageNumber: prevPageNumber,
                                nextPageNumber: nextPageNumber,
                                previousPagePath: previousPagePath,
                                nextPagePath: nextPagePath,
                                author: node.frontmatter,
                            },
                        })
                    })
                })
                return resolve()
            })
        )
    })

    /**
     * Pages
     */
    const createStaticPages = new Promise((resolve, reject) => {
        const pageTemplate = path.resolve(`./src/templates/page.js`)
        resolve(
            graphql(`
                {
                    allMarkdownRemark(
                        filter: {
                            frontmatter: { draft: { ne: true } }
                            fileAbsolutePath: { regex: "/pages/" }
                        }
                    ) {
                        edges {
                            node {
                                frontmatter {
                                    slug
                                }
                                fileAbsolutePath
                            }
                        }
                    }
                }
            `).then((result) => {
                if (result.errors) {
                    return reject(result.errors)
                }

                if (!result.data.allMarkdownRemark) {
                    return resolve()
                }

                const items = result.data.allMarkdownRemark.edges
                items.forEach(({ node }) => {
                    // This part here defines, that our pages will use
                    // a `/:slug/` permalink.
                    node.url = `/${node.frontmatter.slug}/`

                    createPage({
                        path: node.url,
                        component: path.resolve(pageTemplate),
                        context: {
                            // Data passed to context is available
                            // in page queries as GraphQL variables.
                            slug: node.frontmatter.slug,
                        },
                    })
                })
                return resolve()

                // items.forEach(({ node }) => {
                //     // const totalPosts = node.postCount !== null ? node.postCount : 0
                //     const totalPosts = 1
                //     const numberOfPages = Math.ceil(totalPosts / postsPerPage)
                //
                //     // This part here defines, that our author pages will use
                //     // a `/author/:slug/` permalink.
                //     node.frontmatter.url = `/author/${node.frontmatter.slug}/`
                //
                //     Array.from({ length: numberOfPages }).forEach((_, i) => {
                //         const currentPage = i + 1
                //         const prevPageNumber = currentPage <= 1 ? null : currentPage - 1
                //         const nextPageNumber = currentPage + 1 > numberOfPages ? null : currentPage + 1
                //         const previousPagePath = prevPageNumber ? prevPageNumber === 1 ? node.frontmatter.url : `${node.frontmatter.url}page/${prevPageNumber}/` : null
                //         const nextPagePath = nextPageNumber ? `${node.frontmatter.url}page/${nextPageNumber}/` : null
                //         // console.log("author node -> ", node);
                //         createPage({
                //             path: i === 0 ? node.frontmatter.url : `${node.frontmatter.url}page/${i + 1}/`,
                //             component: path.resolve(authorTemplate),
                //             context: {
                //                 // Data passed to context is available
                //                 // in page queries as GraphQL variables.
                //                 slug: node.frontmatter.slug,
                //                 limit: postsPerPage,
                //                 skip: i * postsPerPage,
                //                 numberOfPages: numberOfPages,
                //                 humanPageNumber: currentPage,
                //                 prevPageNumber: prevPageNumber,
                //                 nextPageNumber: nextPageNumber,
                //                 previousPagePath: previousPagePath,
                //                 nextPagePath: nextPagePath,
                //                 author: node.frontmatter,
                //             },
                //         })
                //     })
                // })
                return resolve()
            })
        )
    })

    return Promise.all([createPosts, createTags, createAuthors, createStaticPages])
}
