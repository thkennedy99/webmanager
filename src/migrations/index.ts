import * as migration_20260308_190647_add_store_subscriptions_mailing_list from './20260308_190647_add_store_subscriptions_mailing_list';

export const migrations = [
  {
    up: migration_20260308_190647_add_store_subscriptions_mailing_list.up,
    down: migration_20260308_190647_add_store_subscriptions_mailing_list.down,
    name: '20260308_190647_add_store_subscriptions_mailing_list'
  },
];
