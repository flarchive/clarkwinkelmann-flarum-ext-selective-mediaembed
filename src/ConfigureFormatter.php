<?php

namespace ClarkWinkelmann\SelectiveMediaEmbed;

use Flarum\Settings\SettingsRepositoryInterface;
use s9e\TextFormatter\Configurator;

class ConfigureFormatter
{
    public function __construct(
        protected SettingsRepositoryInterface $settings
    )
    {
    }

    public function __invoke(Configurator $configurator): void
    {
        $siteIds = json_decode($this->settings->get('clarkwinkelmann-selective-mediaembed.enabledSites'));

        if (!is_array($siteIds)) {
            return;
        }

        foreach ($siteIds as $siteId) {
            if (!$configurator->MediaEmbed->defaultSites->exists($siteId)) {
                continue;
            }

            $configurator->MediaEmbed->add($siteId);
        }
    }
}
