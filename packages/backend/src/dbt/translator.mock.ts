import {
    DbtModelColumn,
    DbtModelNode,
    DimensionType,
    FieldType,
    MetricType,
    Table,
} from 'common';
import { WarehouseCatalog } from '../types';

export const VALID_ID_COLUMN_NAMES = [
    { input: 'userid', output: 'user' },
    { input: 'user_id', output: 'user' },
    { input: 'user__id', output: 'user' },
    { input: 'UNiqUE_*093USER___ID', output: 'unique_user' },
    { input: 'gid', output: 'g' },
    { input: 'userId', output: 'user' },
    { input: 'USERID', output: 'user' },
    { input: '$$__nth.rc*#)id', output: 'nth_rc' },
    { input: '0932_user_id', output: 'user' },
];

export const INVALID_ID_COLUMN_NAMES = [
    'isValid',
    'invalid',
    '',
    'id',
    'i',
    'my_fave_column',
    '12345_id',
];

const ID_COLUMN_WITHOUT_METRICS: DbtModelColumn = {
    name: 'user_id',
    meta: {},
    data_type: DimensionType.STRING,
};

const column: DbtModelColumn = {
    name: 'myColumnName',
    meta: {},
};

const COLUMN_WITH_METRIC: Record<string, DbtModelColumn> = {
    user_id: {
        name: 'user_id',
        data_type: DimensionType.STRING,
        meta: {
            metrics: {
                user_count: { type: MetricType.COUNT_DISTINCT },
            },
        },
    },
};

export const model: DbtModelNode = {
    unique_id: 'unique_id',
    description: 'my fun table',
    resource_type: 'resource_type',
    columns: {
        myColumnName: column,
    },
    meta: {},
    database: 'myDatabase',
    schema: 'mySchema',
    name: 'myTable',
    relation_name: 'relation_name',
    depends_on: { nodes: [] },
    root_path: 'root_path',
    patch_path: null,
};

export const MODEL_WITH_NO_METRICS: DbtModelNode = {
    ...model,
    columns: {
        [ID_COLUMN_WITHOUT_METRICS.name]: ID_COLUMN_WITHOUT_METRICS,
    },
};

export const LIGHTDASH_TABLE_WITH_AUTO_METRICS: Omit<Table, 'lineageGraph'> = {
    name: MODEL_WITH_NO_METRICS.name,
    database: MODEL_WITH_NO_METRICS.database,
    schema: MODEL_WITH_NO_METRICS.schema,
    sqlTable: MODEL_WITH_NO_METRICS.relation_name,
    description: MODEL_WITH_NO_METRICS.description,
    dimensions: {
        user_id: {
            fieldType: FieldType.DIMENSION,
            description: undefined,
            type: DimensionType.STRING,
            sql: '${TABLE}.user_id',
            name: 'user_id',
            table: MODEL_WITH_NO_METRICS.name,
            source: undefined,
        },
    },
    metrics: {
        user_count: {
            fieldType: FieldType.METRIC,
            type: MetricType.COUNT_DISTINCT,
            sql: '${TABLE}.user_id',
            name: 'user_count',
            isAutoGenerated: true,
            table: MODEL_WITH_NO_METRICS.name,
            description:
                'Count of unique Users. Lightdash has created this metric automatically.',
        },
    },
};

export const MODEL_WITH_METRIC: DbtModelNode = {
    ...model,
    description: 'my test table',
    columns: COLUMN_WITH_METRIC,
};

export const LIGHTDASH_TABLE_WITH_METRIC: Omit<Table, 'lineageGraph'> = {
    name: MODEL_WITH_METRIC.name,
    database: MODEL_WITH_METRIC.database,
    schema: MODEL_WITH_METRIC.schema,
    sqlTable: MODEL_WITH_METRIC.relation_name,
    description: MODEL_WITH_METRIC.description,
    dimensions: {
        user_id: {
            fieldType: FieldType.DIMENSION,
            description: undefined,
            type: DimensionType.STRING,
            sql: '${TABLE}.user_id',
            name: 'user_id',
            table: MODEL_WITH_METRIC.name,
            source: undefined,
        },
    },
    metrics: {
        user_count: {
            fieldType: FieldType.METRIC,
            type: MetricType.COUNT_DISTINCT,
            sql: '${TABLE}.user_id',
            name: 'user_count',
            table: MODEL_WITH_METRIC.name,
            description: 'Count distinct of User id',
            source: undefined,
            isAutoGenerated: false,
        },
    },
};

export const warehouseSchema: WarehouseCatalog = {
    [model.database]: {
        [model.schema]: {
            [model.name]: {
                [column.name]: DimensionType.STRING,
            },
        },
    },
};

export const warehouseSchemaWithMissingTable: WarehouseCatalog = {
    [model.database]: {
        [model.schema]: {},
    },
};
export const warehouseSchemaWithMissingColumn: WarehouseCatalog = {
    [model.database]: {
        [model.schema]: {
            [model.name]: {},
        },
    },
};

export const expectedModelWithType: DbtModelNode = {
    ...model,
    columns: {
        myColumnName: { ...column, data_type: DimensionType.STRING },
    },
};
