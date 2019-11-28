import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'

import { Layout, PostCard, Pagination } from '../components/common'
import { MetaData } from '../components/common/meta'

/**
* Author page (/author/:slug)
*
* Loads all posts for the requested author incl. pagination.
*
*/
const Author = ({ data, location, pageContext }) => {
    const author = pageContext.author
    const posts = data.allMarkdownRemark.edges
    const twitterUrl = author.twitter ? `https://twitter.com/${author.twitter.replace(/^@/, ``)}` : null
    const facebookUrl = author.facebook ? `https://www.facebook.com/${author.facebook.replace(/^\//, ``)}` : null
    // console.log(`Authors -> `, author)
    return (
        <>
            <MetaData
                data={author}
                location={location}
                type="author"
                {...author}
            />
            <Layout>
                <div className="container">
                    <header className="author-header">
                        <div className="author-header-content">
                            <h1>{author.name}</h1>
                            {author.bio && <p>{author.bio}</p>}
                            <div className="author-header-meta">
                                {author.website && <a className="author-header-item" href={author.website} target="_blank" rel="noopener noreferrer">Website</a>}
                                {twitterUrl && <a className="author-header-item" href={twitterUrl} target="_blank" rel="noopener noreferrer">Twitter</a>}
                                {facebookUrl && <a className="author-header-item" href={facebookUrl} target="_blank" rel="noopener noreferrer">Facebook</a>}
                            </div>
                        </div>
                        <div className="author-header-image">
                            {author.profile_image && <img src={author.profile_image} alt={author.name} />}
                        </div>
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

Author.propTypes = {
    data: PropTypes.shape({
        allMarkdownRemark: PropTypes.object.isRequired,
    }).isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }).isRequired,
    pageContext: PropTypes.object,
}

export default Author

export const pageQuery = graphql`
    query MarkDownAuthorQuery($slug: String!, $limit: Int!, $skip: Int!) {
        allMarkdownRemark(
            filter: {
                frontmatter: {
                    author: {frontmatter: {slug: {eq: $slug}}}
                    draft: { ne: true }
                }
            }
            skip: $skip, 
            limit: $limit
        ){
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
                                description
                            }
                        }
                    }
                    excerpt
                }
            }
        }
    }
`
