import app from 'flarum/admin/app';
import Button from 'flarum/common/components/Button';
import Form from 'flarum/common/components/Form';
import Switch from 'flarum/common/components/Switch';
import ExtensionPage from 'flarum/admin/components/ExtensionPage';
import LoadingModal from 'flarum/admin/components/LoadingModal';

export default class ExtensionPageWithClearCache extends ExtensionPage {
    content(): any {
        const setting = this.setting('clarkwinkelmann-selective-mediaembed.enabledSites');

        let siteIds: string[];

        try {
            siteIds = JSON.parse(setting());
        } catch (error) {
            // silence any error
        }

        // @ts-ignore "used before assigned"
        if (!Array.isArray(siteIds)) {
            siteIds = [];
        }

        return m('.ExtensionPage-settings', m('.container', m(Form, [
            m('.Form-group', [
                Button.component({
                    className: 'Button',
                    onclick: () => {
                        setting(JSON.stringify((app.data.mediaEmbedSites as any).map((site: any) => site.id)));
                    },
                }, app.translator.trans('clarkwinkelmann-selective-mediaembed.admin.selectAll')),
                ' ',
                Button.component({
                    className: 'Button',
                    onclick: () => {
                        setting('[]');
                    },
                }, app.translator.trans('clarkwinkelmann-selective-mediaembed.admin.unselectAll')),
            ]),
            (app.data.mediaEmbedSites as any || []).map((site: any) => m('.Form-group', [
                Switch.component({
                    state: siteIds.indexOf(site.id) !== -1,
                    onchange: (enabled: boolean) => {
                        const i = siteIds.indexOf(site.id);

                        // Shouldn't happen, but in case the new state is same as current state, ignore
                        if (enabled === (i !== -1)) {
                            return;
                        }

                        if (enabled) {
                            siteIds.push(site.id);
                        } else {
                            siteIds.splice(i, 1);
                        }

                        setting(JSON.stringify(siteIds));
                    },
                }, [
                    m('span.mediaembed-site-name', site.name || 'N/A'),
                    site.example ? m('pre.mediaembed-site-example', Array.isArray(site.example) ? site.example.join('\n') : site.example) : null,
                ]),
            ])),
            m('.Form-group.Form-controls', [
                this.submitButton(),
                this.resetButton([{key: 'clarkwinkelmann-selective-mediaembed.enabledSites'}]),
            ]),
            m('.Form-group', m('.Alert', [
                app.translator.trans('clarkwinkelmann-selective-mediaembed.admin.mustClearCache'),
                ' ',
                Button.component({
                    className: 'Button',
                    onclick() {
                        app.modal.show(LoadingModal);

                        // Same code as in core's StatusWidget
                        app.request({
                            method: 'DELETE',
                            url: app.forum.attribute('apiUrl') + '/cache',
                        }).then(() => window.location.reload());
                    },
                }, app.translator.trans('clarkwinkelmann-selective-mediaembed.admin.clearCache')),
            ]))
        ])));
    }
}
