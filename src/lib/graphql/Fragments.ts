/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import gql from 'graphql-tag';

export const PAGE_INFO = gql`
    fragment PAGE_INFO on PageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
    }
`;

export const GLOBAL_METADATA = gql`
    fragment GLOBAL_METADATA on GlobalMetaType {
        key
        value
    }
`;

export const FULL_CATEGORY_FIELDS = gql`
    fragment FULL_CATEGORY_FIELDS on CategoryType {
        default
        id
        includeInUpdate
        name
        order
        meta {
            key
            value
        }
        mangas {
            totalCount
        }
    }
`;

export const PARTIAL_SOURCE_FIELDS = gql`
    fragment PARTIAL_SOURCE_FIELDS on SourceType {
        displayName
        iconUrl
        id
        isConfigurable
        isNsfw
        lang
        name
        supportsLatest
    }
`;

export const FULL_SOURCE_FIELDS = gql`
    ${PARTIAL_SOURCE_FIELDS}
    fragment FULL_SOURCE_FIELDS on SourceType {
        ...PARTIAL_SOURCE_FIELDS
        preferences {
            ... on CheckBoxPreference {
                type: __typename
                CheckBoxCheckBoxCurrentValue: currentValue
                summary
                CheckBoxDefault: default
                key
                CheckBoxTitle: title
            }
            ... on EditTextPreference {
                type: __typename
                EditTextPreferenceCurrentValue: currentValue
                EditTextPreferenceDefault: default
                EditTextPreferenceTitle: title
                text
                summary
                key
                dialogTitle
                dialogMessage
            }
            ... on SwitchPreference {
                type: __typename
                SwitchPreferenceCurrentValue: currentValue
                summary
                key
                SwitchPreferenceDefault: default
                SwitchPreferenceTitle: title
            }
            ... on MultiSelectListPreference {
                type: __typename
                dialogMessage
                dialogTitle
                MultiSelectListPreferenceTitle: title
                summary
                key
                entryValues
                entries
                MultiSelectListPreferenceDefault: default
                MultiSelectListPreferenceCurrentValue: currentValue
            }
            ... on ListPreference {
                type: __typename
                ListPreferenceCurrentValue: currentValue
                ListPreferenceDefault: default
                ListPreferenceTitle: title
                summary
                key
                entryValues
                entries
            }
        }
        filters {
            ... on TriStateFilter {
                type: __typename
                name
                TriStateFilterDefault: default
            }
            ... on CheckBoxFilter {
                type: __typename
                CheckBoxFilterDefault: default
                name
            }
            ... on TextFilter {
                type: __typename
                name
                TextFilterDefault: default
            }
            ... on SortFilter {
                type: __typename
                values
                name
                SortFilterDefault: default {
                    ascending
                    index
                }
            }
            ... on SeparatorFilter {
                type: __typename
                name
            }
            ... on SelectFilter {
                type: __typename
                values
                name
                SelectFilterDefault: default
            }
            ... on HeaderFilter {
                type: __typename
                name
            }
            ... on GroupFilter {
                type: __typename
                name
                filters {
                    ... on CheckBoxFilter {
                        type: __typename
                        CheckBoxFilterDefault: default
                        name
                    }
                    ... on HeaderFilter {
                        type: __typename
                        name
                    }
                    ... on SelectFilter {
                        type: __typename
                        SelectFilterDefault: default
                        name
                        values
                    }
                    ... on TriStateFilter {
                        type: __typename
                        TriStateFilterDefault: default
                        name
                    }
                    ... on TextFilter {
                        type: __typename
                        TextFilterDefault: default
                        name
                    }
                    ... on SortFilter {
                        type: __typename
                        SorSortFilterDefault: default {
                            ascending
                            index
                        }
                        name
                        values
                    }
                    ... on SeparatorFilter {
                        type: __typename
                        name
                    }
                }
            }
        }
    }
`;

export const BASE_MANGA_FIELDS = gql`
    ${PARTIAL_SOURCE_FIELDS}
    fragment BASE_MANGA_FIELDS on MangaType {
        artist
        author
        chaptersLastFetchedAt
        description
        genre
        id
        inLibrary
        inLibraryAt
        initialized
        lastFetchedAt
        meta {
            key
            value
        }
        realUrl
        source {
            ...PARTIAL_SOURCE_FIELDS
        }
        status
        thumbnailUrl
        title
        url
    }
`;

export const PARTIAL_MANGA_FIELDS = gql`
    ${BASE_MANGA_FIELDS}
    ${FULL_CATEGORY_FIELDS}
    ${PARTIAL_SOURCE_FIELDS}
    fragment PARTIAL_MANGA_FIELDS on MangaType {
        ...BASE_MANGA_FIELDS
        unreadCount
        downloadCount
        categories {
            nodes {
                ...FULL_CATEGORY_FIELDS
            }
            totalCount
        }
        chapters {
            totalCount
        }
    }
`;

export const FULL_CHAPTER_FIELDS = gql`
    ${PARTIAL_MANGA_FIELDS}
    fragment FULL_CHAPTER_FIELDS on ChapterType {
        chapterNumber
        fetchedAt
        id
        isBookmarked
        isDownloaded
        isRead
        lastPageRead
        lastReadAt
        manga {
            ...PARTIAL_MANGA_FIELDS
        }
        meta {
            key
            value
        }
        name
        pageCount
        realUrl
        scanlator
        sourceOrder
        uploadDate
        url
    }
`;

export const FULL_MANGA_FIELDS = gql`
    ${PARTIAL_MANGA_FIELDS}
    ${FULL_CHAPTER_FIELDS}
    fragment FULL_MANGA_FIELDS on MangaType {
        ...PARTIAL_MANGA_FIELDS
        lastReadChapter {
            ...FULL_CHAPTER_FIELDS
        }
    }
`;

export const FULL_EXTENSION_FIELDS = gql`
    fragment FULL_EXTENSION_FIELDS on ExtensionType {
        apkName
        hasUpdate
        iconUrl
        isInstalled
        isNsfw
        isObsolete
        lang
        name
        pkgName
        versionCode
        versionName
    }
`;

export const FULL_DOWNLOAD_STATUS = gql`
    ${FULL_CHAPTER_FIELDS}
    fragment FULL_DOWNLOAD_STATUS on DownloadStatus {
        queue {
            chapter {
                ...FULL_CHAPTER_FIELDS
            }
            progress
            state
            tries
        }
        state
    }
`;

export const PARTIAL_UPDATER_STATUS = gql`
    fragment PARTIAL_UPDATER_STATUS on UpdateStatus {
        isRunning
    }
`;

export const FULL_UPDATER_STATUS = gql`
    ${FULL_MANGA_FIELDS}
    ${PARTIAL_UPDATER_STATUS}
    ${FULL_CATEGORY_FIELDS}
    fragment FULL_UPDATER_STATUS on UpdateStatus {
        ...PARTIAL_UPDATER_STATUS
        completeJobs {
            mangas {
                nodes {
                    ...FULL_MANGA_FIELDS
                }
                totalCount
            }
        }
        failedJobs {
            mangas {
                nodes {
                    ...FULL_MANGA_FIELDS
                }
                totalCount
            }
        }
        pendingJobs {
            mangas {
                nodes {
                    ...FULL_MANGA_FIELDS
                }
                totalCount
            }
        }
        runningJobs {
            mangas {
                nodes {
                    ...FULL_MANGA_FIELDS
                }
                totalCount
            }
        }
        skippedJobs {
            mangas {
                nodes {
                    ...FULL_MANGA_FIELDS
                }
                totalCount
            }
        }
        updatingCategories {
            categories {
                nodes {
                    ...FULL_CATEGORY_FIELDS
                }
                totalCount
            }
        }
        skippedCategories {
            categories {
                nodes {
                    ...FULL_CATEGORY_FIELDS
                }
                totalCount
            }
        }
    }
`;

export const WEBUI_UPDATE_INFO = gql`
    fragment WEBUI_UPDATE_INFO on WebUIUpdateInfo {
        channel
        tag
        updateAvailable
    }
`;

export const WEBUI_UPDATE_STATUS = gql`
    ${WEBUI_UPDATE_INFO}
    fragment WEBUI_UPDATE_STATUS on WebUIUpdateStatus {
        info {
            ...WEBUI_UPDATE_INFO
        }
        progress
        state
    }
`;

export const SERVER_SETTINGS = gql`
    fragment SERVER_SETTINGS on SettingsType {
        autoDownloadNewChapters
        backupInterval
        backupPath
        backupTTL
        backupTime
        basicAuthEnabled
        basicAuthPassword
        basicAuthUsername
        debugLogsEnabled
        downloadAsCbz
        downloadsPath
        electronPath
        excludeCompleted
        excludeNotStarted
        excludeUnreadChapters
        globalUpdateInterval
        initialOpenInBrowserEnabled
        ip
        localSourcePath
        maxSourcesInParallel
        port
        socksProxyEnabled
        socksProxyHost
        socksProxyPort
        systemTrayEnabled
        webUIChannel
        webUIFlavor
        webUIInterface
        webUIUpdateCheckInterval
    }
`;