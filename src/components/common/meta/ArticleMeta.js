import React from 'react'
import Helmet from "react-helmet"
import { StaticQuery, graphql } from 'gatsby'
import PropTypes from 'prop-types'
import _ from 'lodash'
import url from 'url'

import getAuthorProperties from './getAuthorProperties'
import ImageMeta from './ImageMeta'
import config from '../../../utils/siteConfig'

import { tags as tagsHelper } from '@tryghost/helpers'

const ArticleMetaGhost = ({ data, settings, canonical, id }) => {
    const ghostPost = data
    settings = config

    const author = getAuthorProperties(ghostPost.frontmatter.author.frontmatter)
    const publicTags = _.map(tagsHelper(ghostPost, { visibility: `public`, fn: tag => tag }), `name`)
    const primaryTag = publicTags[0] || ``
    const shareImage = ghostPost.frontmatter.feature_image
        ? ghostPost.frontmatter.feature_image.childImageSharp.fluid.src
        : _.get(config, `cover_image`, null);
    const publisherLogo = config.siteIcon ? url.resolve(config.siteUrl, config.siteIcon) : null
    const articleId = id;

    return (
        <>
            <Helmet>
                <title>{ghostPost.frontmatter.meta_title || ghostPost.frontmatter.title}</title>
                <meta name="description" content={ghostPost.frontmatter.meta_description || ghostPost.excerpt} />
                <link rel="canonical" href={canonical} />

                <meta property="og:site_name" content={config.title} />
                <meta property="og:type" content="article" />
                <meta property="og:title"
                    content={
                        ghostPost.frontmatter.og_title ||
                        ghostPost.frontmatter.meta_title ||
                        ghostPost.frontmatter.title
                    }
                />
                <meta property="og:description"
                    content={
                        ghostPost.frontmatter.og_description ||
                        ghostPost.frontmatter.meta_description ||
                        ghostPost.frontmatter.excerpt
                    }
                />
                <meta property="og:url" content={canonical} />
                <meta property="article:published_time" content={ghostPost.frontmatter.published_at} />
                <meta property="article:modified_time" content={ghostPost.frontmatter.updated_at} />
                {publicTags.map((keyword, i) => (<meta property="article:tag" content={keyword} key={i} />))}
                {author.facebookUrl && <meta property="article:author" content={author.facebookUrl} />}

                <meta name="twitter:title"
                    content={
                        ghostPost.twitter_title ||
                        ghostPost.meta_title ||
                        ghostPost.title
                    }
                />
                <meta name="twitter:description"
                    content={
                        ghostPost.twitter_description ||
                        ghostPost.excerpt ||
                        ghostPost.meta_description
                    }
                />
                <meta name="twitter:url" content={canonical} />
                <meta name="twitter:label1" content="Written by" />
                <meta name="twitter:data1" content={author.name} />
                {primaryTag && <meta name="twitter:label2" content="Filed under" />}
                {primaryTag && <meta name="twitter:data2" content={primaryTag} />}

                {settings.twitter && <meta name="twitter:site" content={`https://twitter.com/${settings.twitter.replace(/^@/, ``)}/`} />}
                {settings.twitter && <meta name="twitter:creator" content={settings.twitter} />}
                <script type="application/ld+json">{`
                    {
                        "@context": "https://schema.org/",
                        "@type": "Article",
                        "author": {
                            "@type": "Person",
                            "name": "${author.name}",
                            ${author.image ? author.sameAsArray ? `"image": "${author.image}",` : `"image": "${author.image}"` : ``}
                            ${author.sameAsArray ? `"sameAs": ${author.sameAsArray}` : ``}
                        },
                        ${publicTags.length ? `"keywords": "${_.join(publicTags, `, `)}",` : ``}
                        "headline": "${ghostPost.frontmatter.meta_title || ghostPost.frontmatter.title}",
                        "url": "${canonical}",
                        "datePublished": "${ghostPost.frontmatter.published_at}",
                        "dateModified": "${ghostPost.frontmatter.updated_at}",
                        ${shareImage ? `"image": {
                                "@type": "ImageObject",
                                "url": "${shareImage}",
                                "width": "${config.shareImageWidth}",
                                "height": "${config.shareImageHeight}"
                            },` : ``}
                        "publisher": {
                            "@type": "Organization",
                            "name": "${settings.title}",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "${publisherLogo}",
                                "width": 60,
                                "height": 60
                            }
                        },
                        "description": "${ghostPost.frontmatter.meta_description || ghostPost.frontmatter.excerpt}",
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": "${config.siteUrl}"
                        }
                    }
                `}</script>
                <script type="application/javascript">
                    {`console.log("Called"); window.pageId="${articleId}"`}
                </script>
            </Helmet>
            <ImageMeta image={shareImage} />
        </>
    )
}

ArticleMetaGhost.propTypes = {
    data: PropTypes.shape({
        html: PropTypes.string.isRequired,
        frontmatter: PropTypes.object.isRequired,
        excerpt: PropTypes.string.isRequired,
    }).isRequired,
    settings: PropTypes.shape({
        allGhostSettings: PropTypes.object.isRequired,
    }).isRequired,
    canonical: PropTypes.string.isRequired,
}

// const ArticleMetaQuery = props => (
//     <StaticQuery
//         query={graphql`
//             query {
//                 allGhostSettings {
//                     edges {
//                         node {
//                             ...GhostSettingsFields
//                         }
//                     }
//                 }
//             }
//         `}
//         render={data => <ArticleMetaGhost settings={data} {...props} />}
//     />
// )

export default ArticleMetaGhost
