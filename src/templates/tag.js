import React from "react"
import PropTypes from "prop-types"
import { graphql } from "gatsby"

import { Layout, PostCard, Pagination } from "../components/common"
import { MetaData } from "../components/common/meta"

/**
 * Tag page (/tag/:slug)
 *
 * Loads all posts for the requested tag incl. pagination.
 *
 */
const Tag = ({ data, location, pageContext }) => {
    // console.log(`TAGS -> `, data, pageContext)

    const tagName = pageContext.tag.name
    const tagDescription = pageContext.tag.description
    
    const posts = data.allMarkdownRemark.edges.filter(({ node }) => node.excerpt)

    return (
        <>
            <MetaData
                data={data}
                location={location}
                type="tag"
                name={pageContext.tag.name}
                description={pageContext.tag.description}
                image={pageContext.tag.feature_image}
            />
            <Layout>
                <div className="container">
                    <header className="tag-header">
                        <h1>{tagName}</h1>
                        {tagDescription ? <p>{tagDescription}</p> : null}
                    </header>
                    <section className="post-feed">
                        {posts.map(({ node }) => (
                            // The tag below includes the markup for each post - components/common/PostCard.js
                            <PostCard key={node.id} post={node} />
                        ))}
                    </section>
                    <Pagination pageContext={pageContext} />
                </div>
            </Layout>
        </>
    )
}

Tag.propTypes = {
    data: PropTypes.shape({
        allMarkdownRemark: PropTypes.object,
    }).isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }).isRequired,
    pageContext: PropTypes.object,
}

export default Tag

// export const pageQuery = graphql`
//     query GhostTagQuery($slug: String!, $limit: Int!, $skip: Int!) {
//         ghostTag(slug: { eq: $slug }) {
//             ...GhostTagFields
//         }
//         allGhostPost(
//             sort: { order: DESC, fields: [published_at] },
//             filter: {tags: {elemMatch: {slug: {eq: $slug}}}},
//             limit: $limit,
//             skip: $skip
//         ) {
//             edges {
//                 node {
//                 ...GhostPostFields
//                 }
//             }
//         }
//     }
// `
export const pageQuery = graphql`
    query MarkdownTagQuery($slug: String, $limit: Int!, $skip: Int!) {
        allMarkdownRemark(
            limit: $limit
            sort: { fields: [frontmatter___published_at], order: DESC }
            filter: {
                frontmatter: {
                    tags: { elemMatch: { frontmatter: { slug: { eq: $slug } } } }
                    draft: { ne: true }
                }
            }
            skip: $skip
        ) {
            totalCount
            edges {
                node {
                    id
                    html
                    frontmatter {
                        title
                        slug
                        tags {
                            frontmatter {
                                name
                                slug
                            }
                        }
                        feature_image {
                            childImageSharp {
                                fluid(maxWidth: 400, maxHeight: 250) {
                                    ...GatsbyImageSharpFluid
                                }
                            }
                          }
                        author {
                            frontmatter {
                                name
                                profile_image
                            }
                        }
                    }
                    excerpt
                }
            }
        }
    }
`
