import { SystemSetting } from '@/types';

export const MOCK_SYSTEM_SETTINGS: SystemSetting[] = [
  {
    id: '41d7c8d3-bad6-4a18-953e-d05030df1c44',
    key: 'default_box_cost',
    value: '1',
    description: 'Default printed box cost (INR)',
    updatedAt: '2026-05-15T11:53:46.485Z',
  },
  {
    id: '716fdf35-decb-49fd-b763-4a9b88b34ff2',
    key: 'default_ccpc_cost',
    value: '12',
    description: 'Default CCPC cost (INR)',
    updatedAt: '2026-05-15T11:53:47.980Z',
  },
  {
    id: 'a9e17d37-e044-44e5-9175-01b4e671b6a7',
    key: 'default_pack_weight_g',
    value: '850',
    description: 'Default pack size in grams',
    updatedAt: '2026-05-15T11:53:40.474Z',
  },
  {
    id: '5f6855cc-ab0e-450f-b070-19ce53f3f042',
    key: 'default_pouch_cost',
    value: '30',
    description: 'Default printed pouch cost (INR)',
    updatedAt: '2026-05-15T11:53:44.972Z',
  },
  {
    id: '74f0f37c-da59-4907-8ab1-52f05d256da6',
    key: 'profit_margin_percent',
    value: '15',
    description: 'Profit margin percentage',
    updatedAt: '2026-05-15T11:53:43.479Z',
  },
  {
    id: '31564c79-c984-4924-9011-d7b1681a426f',
    key: 'wastage_percent',
    value: '2',
    description: 'Material wastage percentage',
    updatedAt: '2026-05-15T11:53:41.980Z',
  },
];
