import React from 'react'
import Helmet from "react-helmet"
import PropTypes from 'prop-types'
import _ from 'lodash'
import { StaticQuery, graphql } from 'gatsby'
import url from 'url'

import ImageMeta from './ImageMeta'
import config from '../../../utils/siteConfig'

const WebsiteMeta = ({ data, canonical, name, description, image, type }) => {
    // (`WebsiteMeta ->`, data, name, description, image)

    const publisherLogo = url.resolve(config.siteUrl, config.siteIcon)
    let shareImage = image || _.get(config, `cover_image`, null)

    shareImage = shareImage ? url.resolve(config.siteUrl, shareImage) : null

    description = description || data.meta_description || data.description || config.siteDescriptionMeta || config.siteDescriptionMeta
    const title = `${name} - ${config.siteTitleMeta}`

    return (
        <>
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={description} />
                <link rel="canonical" href={canonical} />
                <meta
                    property="og:site_name"
                    content={config.siteTitleMeta}
                />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:url" content={canonical} />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:url" content={canonical} />

                {config.siteTwitterHandle && (
                    <meta
                        name="twitter:site"
                        content={`https://twitter.com/${config.siteTwitterHandle.replace(
                            /^@/,
                            ``
                        )}/`}
                    />
                )}
                {config.siteTwitterHandle && (
                    <meta
                        name="twitter:creator"
                        content={config.siteTwitterHandle}
                    />
                )}
                <script type="application/ld+json">{`
                    {
                        "@context": "https://schema.org/",
                        "@type": "${type}",
                        "url": "${canonical}",
                        ${
                            shareImage
                                ? `"image": {
                                "@type": "ImageObject",
                                "url": "${shareImage}",
                                "width": "${config.shareImageWidth}",
                                "height": "${config.shareImageHeight}"
                            },`
                                : ``
                        }
                        "publisher": {
                            "@type": "Organization",
                            "name": "${config.siteTitleMeta}",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "${publisherLogo}",
                                "width": 60,
                                "height": 60
                            }
                        },
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": "${config.siteUrl}"
                        },
                        "description": "${description}"
                    }
                `}</script>
                <script>
                    {`
                       if (window.netlifyIdentity) {
                        window.netlifyIdentity.on("init", user => {
                          if (!user) {
                            window.netlifyIdentity.on("login", () => {
                              document.location.href = "/admin/";
                            });
                          }
                        });
                      }
                    
                `}</script>
            </Helmet>
            <ImageMeta image={shareImage} />
        </>
    )
}

WebsiteMeta.propTypes = {
    data: PropTypes.shape({
        title: PropTypes.string,
        feature_image: PropTypes.string,
        description: PropTypes.string,
        bio: PropTypes.string,
        profile_image: PropTypes.string,
    }).isRequired,
    canonical: PropTypes.string.isRequired,
    name: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string,
    type: PropTypes.oneOf([`website`, `tag`]).isRequired,
}

// const WebsiteMetaQuery = props => (
//     <StaticQuery
//         query={graphql`
//             query GhostSettingsWebsiteMeta {
//                 allGhostSettings {
//                     edges {
//                         node {
//                             ...GhostSettingsFields
//                         }
//                     }
//                 }
//             }
//         `}
//         render={data => <WebsiteMeta settings={data} {...props} />}
//     />
// )

export default WebsiteMeta
