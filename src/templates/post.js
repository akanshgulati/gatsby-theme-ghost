import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Img from 'gatsby-image'
import { Link } from 'gatsby'
import { Layout } from '../components/common'
import { MetaData } from '../components/common/meta'
import { DiscussionEmbed } from "disqus-react"
import config from "../utils/siteConfig"
/**
* Single post view (/:slug)
*
* This file renders a single post and loads all the content.
*
*/
class Post extends React.Component {

    constructor(props) {
        super(props)
        this.state = { commentsEnabled: false }
        this.showComments = this.showComments.bind(this)
    }

    showComments() {
        this.setState(_ => {
            return {
                commentsEnabled: true,
            }
        })
    }
    render(){
        const { data, location } = this.props
        const post = data.markdownRemark
        const disqusShortname = config.disqusShortname
        const disqusConfig = {
            identifier: post.frontmatter.id,
            title: post.frontmatter.title,
        }

        return (
            <>
                <MetaData data={data} location={location} id={post.frontmatter.id} type="article" />
                <Layout>
                    <div className="container">
                        <article className="content">
                            <header className="post-full-header">
                                <div className="post-full-meta">
                                    <time
                                        className="post-full-meta-date"
                                        dateTime="{post.frontmatter.published_at}"
                                    >
                                        {post.frontmatter.published_at}
                                    </time>

                                    {post.frontmatter.tags.map(({ frontmatter }) => (
                                        <span key={frontmatter.name}>
                                            <span className="date-divider">/</span>
                                            <Link to={`tag/${frontmatter.slug}`}>{frontmatter.name}</Link>
                                        </span>
                                    ))}
                                </div>
                                <h1 className="post-full-title">
                                    {post.frontmatter.title}
                                </h1>
                            </header>
                            {post.frontmatter.feature_image ? (
                                <figure className="post-feature-image">
                                    {post.frontmatter.feature_image && post.frontmatter.feature_image.childImageSharp &&
                                    <Img fluid={post.frontmatter.feature_image.childImageSharp.fluid}/>
                                    }
                                    {/* <img
                                    src={post.frontmatter.feature_image}
                                    alt={post.frontmatter.title}
                                /> */}
                                </figure>
                            ) : null}
                            <section className="post-full-content">
                                {/* <h1 className="content-title">
                                {post.frontmatter.title}
                            </h1> */}

                                {/* The main post content */}
                                <section
                                    className="content-body load-external-scripts"
                                    dangerouslySetInnerHTML={{
                                        __html: post.html,
                                    }}
                                />
                            </section>
                        </article>
                        {post.frontmatter.comment && !this.state.commentsEnabled && disqusShortname && <div className="show-comment-button" onClick={this.showComments}>Show Comments</div> }
                        {post.frontmatter.comment && this.state.commentsEnabled && disqusShortname && <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />}
                    </div>
                </Layout>
            </>
        )
    }
}
// const Post = ({ data, location, pageContext }) => {
//     // console.log(`POST -> `, data, pageContext)
//
//
// };

Post.propTypes = {
    data: PropTypes.shape({
        markdownRemark: PropTypes.shape({
            excerpt: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    location: PropTypes.object.isRequired,
}

export default Post

export const postQuery = graphql`
  query($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        slug
        title
        feature_image {
            childImageSharp {
              fluid(maxWidth: 1000, maxHeight: 500) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        author {
            frontmatter {
                name
                profile_image
                twitter
                facebook
                website
            }
        }
        tags {
            frontmatter {
                name
                slug
            }
        }
        meta_description
        published_at(formatString: "MMMM DD, YYYY")
        comment,
        id
      }
      excerpt
    }
  }
`
