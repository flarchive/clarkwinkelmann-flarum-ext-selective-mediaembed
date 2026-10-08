import app from 'flarum/admin/app';
import Extend from 'flarum/common/extenders';
import ExtensionPageWithClearCache from './components/ExtensionPageWithClearCache';

export default [
    new Extend.Admin()
        .page(ExtensionPageWithClearCache)
        .generalIndexItems('settings', () => (app.data.mediaEmbedSites as any || []).map((site: any) => {
            return {
                id: site.id,
                tree: [app.translator.trans('clarkwinkelmann-selective-mediaembed.admin.searchIndexTreeSites')],
                label: site.name,
            };
        })),
];
