import { DataSourcePlugin } from '@grafana/data';
import { DataSource } from './DataSource';
import { PrtgConfigEditor } from './ConfigEditor';
import { PrtgQueryEditor } from './QueryEditor';
import { PrtgQuery, PrtgDataSourceOptions } from './types';

export const plugin = new DataSourcePlugin<DataSource, PrtgQuery, PrtgDataSourceOptions>(DataSource)
  .setConfigEditor(PrtgConfigEditor)
  .setQueryEditor(PrtgQueryEditor)
