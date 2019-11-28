import React from 'react'
import Helmet from 'react-helmet'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { StaticQuery, graphql } from 'gatsby'

import ImageMeta from './ImageMeta'
import getAuthorProperties from './getAuthorProperties'
import config from '../../../utils/siteConfig'

const AuthorMeta = ({ data, settings, canonical }) => {
    // console.log(`AuthorMeta->`, data)
    // settings = settings.allGhostSettings.edges[0].node

    const author = getAuthorProperties(data)
    const shareImage = author.image || _.get(config, `cover_image`, null)
    const title = `${data.name} - ${config.siteTitleMeta}`
    const description = data.description || config.siteDescriptionMeta

    return (
        <>
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={description} />
                <link rel="canonical" href={canonical} />
                <meta property="og:site_name" content={config.siteTitleMeta} />
                <meta property="og:type" content="profile" />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:url" content={canonical} />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:url" content={canonical} />
                {config.siteTwitterHandle && <meta name="twitter:site" content={`https://twitter.com/${config.siteTwitterHandle.replace(/^@/, ``)}/`} />}
                {config.siteTwitterHandle && <meta name="twitter:creator" content={config.siteTwitterHandle} />}
                <script type="application/ld+json">{`
                    {
                        "@context": "https://schema.org/",
                        "@type": "Person",
                        "name": "${data.name}",
                        ${author.sameAsArray ? `"sameAs": ${author.sameAsArray},` : ``}
                        "url": "${canonical}",
                        ${shareImage ? `"image": {
                                "@type": "ImageObject",
                                "url": "${shareImage}",
                                "width": "${config.shareImageWidth}",
                                "height": "${config.shareImageHeight}"
                            },` : ``}
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": "${config.siteUrl}"
                        },
                        "description": "${description}"
                    }
                `}</script>
            </Helmet>
            <ImageMeta image={shareImage} />
        </>
    )
}

AuthorMeta.propTypes = {
    data: PropTypes.shape({
        name: PropTypes.string,
        bio: PropTypes.string,
        profile_image: PropTypes.string,
        website: PropTypes.string,
        twitter: PropTypes.string,
        facebook: PropTypes.string,
    }).isRequired,
    settings: PropTypes.shape({
        allGhostSettings: PropTypes.object.isRequired,
    }).isRequired,
    canonical: PropTypes.string.isRequired,
}

// const AuthorMetaQuery = props => (
//     <StaticQuery
//         query={graphql`
//             query GhostSettingsAuthorMeta {
//                 allGhostSettings {
//                     edges {
//                         node {
//                             ...GhostSettingsFields
//                         }
//                     }
//                 }
//             }
//         `}
//         render={data => <AuthorMeta settings={data} {...props} />}
//     />
// )

export default AuthorMeta
