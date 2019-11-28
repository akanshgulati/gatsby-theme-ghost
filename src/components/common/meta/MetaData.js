import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
import url from 'url'

import config from '../../../utils/siteConfig'
import ArticleMeta from './ArticleMeta'
import WebsiteMeta from './WebsiteMeta'
import AuthorMeta from './AuthorMeta'

/**
* MetaData will generate all relevant meta data information incl.
* JSON-LD (schema.org), Open Graph (Facebook) and Twitter properties.
*
*/
const MetaData = ({
    data,
    name,
    description,
    image,
    location,
    type,
    id
}) => {
    // console.log(`metaData->`, data, type)
    const canonical = url.resolve(config.siteUrl, location.pathname, `/`)
    const { ghostPage } = data
    // settings = settings.allGhostSettings.edges[0].node

    if (type === `article`) {
        return (
            <ArticleMeta
                data={data.markdownRemark}
                canonical={canonical}
                id={id}
            />
        )
    } else if (type === `tag`) {
        return (
            <WebsiteMeta
                data={data.allMarkdownRemark}
                canonical={canonical}
                name={name}
                description={description}
                image={image}
                type="tag"
            />
        )
    } else if (type === `author`) {
        return (
            <AuthorMeta
                data={data}
                canonical={canonical}
                description={description}
                image={image}
                type="author"
            />
        )
    } else if (type === `page`) {
        return (
            <WebsiteMeta
                data={ghostPage}
                canonical={canonical}
                type="website"
            />
        )
    } else {
        name = name || config.siteTitleMeta
        description = description || config.siteDescriptionMeta
        image = image || config.cover_image || null

        image = image ? url.resolve(config.siteUrl, image) : null

        return (
            <WebsiteMeta
                data={{}}
                canonical={canonical}
                name={name}
                description={description}
                image={image}
                type="website"
            />
        )
    }
}

MetaData.defaultProps = {
    data: {},
}

MetaData.propTypes = {
    data: PropTypes.shape({
        ghostPost: PropTypes.object,
        ghostTag: PropTypes.object,
        ghostAuthor: PropTypes.object,
        ghostPage: PropTypes.object,
    }).isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }).isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string,
}

// const MetaDataQuery = props => (
//     <StaticQuery
//         query={graphql`
//             query GhostSettingsMetaData {
//                 allGhostSettings {
//                     edges {
//                         node {
//                             title
//                             description
//                         }
//                     }
//                 }
//             }
//         `}
//         render={data => <MetaData settings={data} {...props} />}
//     />
// )

export default MetaData
