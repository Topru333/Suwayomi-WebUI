/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { useTranslation } from 'react-i18next';
import { useContext, useEffect } from 'react';
import { List, ListItem, ListItemButton, ListItemText, Switch } from '@mui/material';
import ListSubheader from '@mui/material/ListSubheader';
import { t as translate } from 'i18next';
import { NavBarContext, useSetDefaultBackTo } from '@/components/context/NavbarContext.tsx';
import { GlobalUpdateSettings } from '@/components/settings/globalUpdate/GlobalUpdateSettings.tsx';
import { MetadataServerSettingKeys, MetadataServerSettings } from '@/typings.ts';
import { convertToGqlMeta, requestUpdateServerMetadata } from '@/util/metadata.ts';
import { makeToast } from '@/components/util/Toast.tsx';
import { convertSettingsToMetadata, useMetadataServerSettings } from '@/util/metadataServerSettings.ts';
import { requestManager } from '@/lib/requests/RequestManager.ts';
import { Mangas } from '@/lib/data/Mangas.ts';

const removeNonLibraryMangasFromCategories = async (): Promise<void> => {
    try {
        const nonLibraryMangas = await requestManager.getMangas({
            filter: { inLibrary: { equalTo: false }, categoryId: { isNull: false } },
        }).response;

        const mangaIdsToRemove = Mangas.getIds(nonLibraryMangas.data.mangas.nodes);

        if (mangaIdsToRemove.length) {
            await requestManager.updateMangasCategories(mangaIdsToRemove, {
                clearCategories: true,
            }).response;
        }
        makeToast(translate('library.settings.advanced.database.cleanup.label.success'), 'success');
    } catch (e) {
        makeToast(translate('library.settings.advanced.database.cleanup.label.error'), 'error');
    }
};

export function LibrarySettings() {
    const { t } = useTranslation();
    const { setTitle, setAction } = useContext(NavBarContext);

    useEffect(() => {
        setTitle(t('library.settings.title'));
        setAction(null);

        return () => {
            setTitle('');
            setAction(null);
        };
    }, [t]);

    useSetDefaultBackTo('settings');

    const { metadata, settings } = useMetadataServerSettings();

    const setSettingValue = <Setting extends MetadataServerSettingKeys>(
        setting: Setting,
        value: MetadataServerSettings[Setting],
    ) => {
        requestUpdateServerMetadata(convertToGqlMeta(metadata)! ?? {}, [
            [setting, convertSettingsToMetadata({ [setting]: value })[setting]],
        ]).catch(() => makeToast(t('search.error.label.failed_to_save_settings'), 'warning'));
    };

    return (
        <List>
            <List
                subheader={
                    <ListSubheader component="div" id="library-general-settings">
                        {t('global.label.general')}
                    </ListSubheader>
                }
            >
                <ListItem>
                    <ListItemText
                        primary={t('library.settings.general.search.ignore_filters.label.title')}
                        secondary={t('library.settings.general.search.ignore_filters.label.description')}
                    />
                    <Switch
                        edge="end"
                        checked={settings.ignoreFilters}
                        onChange={(e) => setSettingValue('ignoreFilters', e.target.checked)}
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary={t('library.settings.general.add_to_library.category_selection.label.title')}
                        secondary={t('library.settings.general.add_to_library.category_selection.label.description')}
                    />
                    <Switch
                        edge="end"
                        checked={settings.showAddToLibraryCategorySelectDialog}
                        onChange={(e) => setSettingValue('showAddToLibraryCategorySelectDialog', e.target.checked)}
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary={t('library.settings.general.remove_from_library.remove_from_categories.label.title')}
                        secondary={t(
                            'library.settings.general.remove_from_library.remove_from_categories.label.description',
                        )}
                    />
                    <Switch
                        edge="end"
                        checked={settings.removeMangaFromCategories}
                        onChange={(e) => setSettingValue('removeMangaFromCategories', e.target.checked)}
                    />
                </ListItem>
            </List>
            <GlobalUpdateSettings />
            <List
                subheader={
                    <ListSubheader component="div" id="library-advanced">
                        {t('global.label.advanced')}
                    </ListSubheader>
                }
            >
                <ListItemButton onClick={() => removeNonLibraryMangasFromCategories()}>
                    <ListItemText
                        primary={t('library.settings.advanced.database.cleanup.label.title')}
                        secondary={t('library.settings.advanced.database.cleanup.label.description')}
                    />
                </ListItemButton>
            </List>
        </List>
    );
}
