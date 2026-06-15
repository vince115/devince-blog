import * as migration_20260413_101007_initial from './20260413_101007_initial';

export const migrations = [
  {
    up: migration_20260413_101007_initial.up,
    down: migration_20260413_101007_initial.down,
    name: '20260413_101007_initial'
  },
];
