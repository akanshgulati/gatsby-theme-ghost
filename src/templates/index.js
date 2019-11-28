import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'

import { Layout, PostCard, Pagination } from '../components/common'
import { MetaData } from '../components/common/meta'

/**
* Main index page (home page)
*
* Loads all posts from Ghost and uses pagination to navigate through them.
* The number of posts that should appear per page can be setup
* in /utils/siteConfig.js under `postsPerPage`.
*
*/
const Index = ({ data, location, pageContext }) => {
    console.log(`Index`, data)
    const posts = data.allMarkdownRemark.edges

    return (
        <>
            <MetaData location={location} />
            <Layout isHome={true}>
                <div className="container">
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

Index.propTypes = {
    data: PropTypes.shape({
        allMarkdownRemark: PropTypes.object.isRequired,
    }).isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }).isRequired,
    pageContext: PropTypes.object,
}

export default Index

// This page query loads all posts sorted descending by published date
// The `limit` and `skip` values are used for pagination

// export const pageQuery = graphql`
//   query GhostPostQuery($limit: Int!, $skip: Int!) {
//     allGhostPost(
//         sort: { order: DESC, fields: [published_at] },
//         limit: $limit,
//         skip: $skip
//     ) {
//       edges {
//         node {
//           ...GhostPostFields
//         }
//       }
//     }
//   }
// `

export const pageQuery = graphql`
    query MarkdownPostQuery($limit: Int!, $skip: Int!) {
        allMarkdownRemark(
            sort: { order: DESC, fields: [frontmatter___published_at] }
            limit: $limit
            skip: $skip
            filter: {
                frontmatter: { draft: { ne: true } }
                fileAbsolutePath: { regex: "/posts/" }
            }
        ) {
            edges {
              node {
                id
                html
                frontmatter {
                  title
                  date
                  draft
                  feature_image {
                    childImageSharp {
                        fluid(maxWidth: 400, maxHeight: 250) {
                            ...GatsbyImageSharpFluid
                        }
                    }
                  }
                  featured
                  published_at
                  weight
                  page
                  created_at
                  slug
                  tag_id
                  name
                  description
                  meta_description
                  meta_title
                  visibility
                  author {
                      frontmatter {
                          name
                          profile_image
                          description
                          slug
                      }
                  }
                  tags {
                      id
                      frontmatter {
                          name
                      }
                  }
                }
                excerpt
              }
            }
          }
    }
`
