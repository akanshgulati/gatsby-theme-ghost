import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
import Img from 'gatsby-image'
import { readingTime as readingTimeHelper } from '@tryghost/helpers'

const PostCard = ({ post }) => {
    // console.log("Postcard", post)
    const url = `/${post.frontmatter.slug}/`
    const readingTime = readingTimeHelper(post)
    
    return (
        <Link to={url} className="post-card">
            <header className="post-card-header">
                {post.frontmatter.feature_image &&
                    post.frontmatter.feature_image.childImageSharp && (
                    <Img
                        fluid={
                            post.frontmatter.feature_image
                                .childImageSharp.fluid
                        }
                        alt={post.frontmatter.title}
                    />
                )}
                {/* {post.frontmatter.feature_image &&
                    <div className="post-card-image" style={{
                        backgroundImage: `url(${post.frontmatter.feature_image})` ,
                    }}></div>} */}
            </header>
            <div className="post-card-content">
                {post.frontmatter.tags && (
                    <span className="post-card-tags">
                        {post.frontmatter.tags[0].frontmatter.name}
                    </span>
                )}
                {post.frontmatter.featured && <span>Featured</span>}
                <h2 className="post-card-title">
                    {post.frontmatter.title}
                </h2>
                <section className="post-card-excerpt">
                    {post.excerpt}
                </section>
                <footer className="post-card-footer">
                    <div className="post-card-footer-left">
                        <div className="post-card-avatar">
                            {post.frontmatter.author ? (
                                <img
                                    className="author-profile-image"
                                    src={
                                        post.frontmatter.author.frontmatter
                                            .profile_image
                                    }
                                    alt={
                                        post.frontmatter.author.frontmatter
                                            .name
                                    }
                                />
                            ) : (
                                <img
                                    className="default-avatar"
                                    src="/images/icons/avatar.svg"
                                    alt={
                                        post.frontmatter.author.frontmatter
                                            .name
                                    }
                                />
                            )}
                        </div>
                        <span className="post-card-author-name">
                            {post.frontmatter.author.frontmatter.name}
                        </span>
                    </div>
                    <div className="post-card-footer-right">
                        <div className="post-reading-time">
                            {readingTime}
                        </div>
                    </div>
                </footer>
            </div>
        </Link>
    )
}

PostCard.propTypes = {
    post: PropTypes.shape({
        frontmatter: PropTypes.object.isRequired,
    }).isRequired,
}

export default PostCard