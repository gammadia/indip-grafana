---
aliases:
  - ../../data-sources/influxdb/query-editor/
  - influxdb-flux/
description: Guide for Flux in Grafana
labels:
  products:
    - cloud
    - enterprise
    - oss
title: Query Editor
weight: 200
refs:
  query-transform-data:
    - pattern: /docs/grafana/
      destination: /docs/grafana/<GRAFANA_VERSION>/panels-visualizations/query-transform-data/
  logs:
    - pattern: /docs/grafana/
      destination: /docs/grafana/<GRAFANA_VERSION>/panels-visualizations/visualizations/logs/
    - pattern: /docs/grafana-cloud/
      destination: /docs/grafana/<GRAFANA_VERSION>/panels-visualizations/visualizations/logs/
  panel-inspector:
    - pattern: /docs/grafana/
      destination: /docs/grafana/<GRAFANA_VERSION>/panels-visualizations/panel-inspector/
    - pattern: /docs/grafana-cloud/
      destination: /docs/grafana/<GRAFANA_VERSION>/panels-visualizations/panel-inspector/
  explore:
    - pattern: /docs/grafana/
      destination: /docs/grafana/<GRAFANA_VERSION>/explore/
    - pattern: /docs/grafana-cloud/
      destination: /docs/grafana/<GRAFANA_VERSION>/explore/
---

# InfluxDB query editor

This topic explains querying specific to the InfluxDB data source.
For general documentation on querying data sources in Grafana, see [Query and transform data](ref:query-transform-data).

## Choose a query editing mode

The InfluxDB data source's query editor has two modes depending on your choice of query language in
the [data source configuration]({{< relref "../#configure-the-data-source" >}}):

- [InfluxQL](#influxql-query-editor)
- [SQL](#sql-query-editor)
- [Flux](#flux-query-editor)

You also use the query editor to retrieve [log data](#query-logs) and [annotate](#apply-annotations) visualizations.

## InfluxQL query editor

The InfluxQL query editor helps you select metrics and tags to create InfluxQL queries.

**To enter edit mode:**

1. Hover over any part of the panel to display the actions menu on the top right corner.
1. Click the menu and select **Edit**.

![InfluxQL query editor](/static/img/docs/influxdb/influxql-query-editor-8-0.png)

### Filter data (WHERE)

To add a tag filter, click the plus icon to the right of the `WHERE` condition.

To remove tag filters, click the tag key, then select **--remove tag filter--**.

#### Match by regular expressions

You can enter regular expressions for metric names or tag filter values.
Wrap the regex pattern in forward slashes (`/`).

Grafana automatically adjusts the filter tag condition to use the InfluxDB regex match condition operator (`=~`).

### Field and aggregation functions

In the `SELECT` row, you can specify which fields and functions to use.

If you have a group by time, you must have an aggregation function.
Some functions like `derivative` also require an aggregation function.

The editor helps you build this part of the query.
For example:

![](/static/img/docs/influxdb/select_editor.png)

This query editor input generates an InfluxDB `SELECT` clause:

```sql
SELECT derivative(mean("value"), 10s) / 10 AS "REQ/s"
FROM....
```

**To select multiple fields:**

1. Click the plus button.
1. Select **Field > field** to add another `SELECT` clause.

   You can also `SELECT` an asterisk (`*`) to select all fields.

### Group query results

To group results by a tag, define it in a "Group By".

**To group by a tag:**

1. Click the plus icon at the end of the GROUP BY row.
1. Select a tag from the dropdown that appears.

**To remove the "Group By":**

1. Click the tag.
1. Click the "x" icon.

### Text editor mode (RAW)

You can write raw InfluxQL queries by switching the editor mode.
However, be careful when writing queries manually.

If you use raw query mode, your query _must_ include at least `WHERE $timeFilter`.

Also, _always_ provide a group by time and an aggregation function.
Otherwise, InfluxDB can easily return hundreds of thousands of data points that can hang your browser.

**To switch to raw query mode:**

1. Click the hamburger icon.
1. Toggle **Switch editor mode**.

### Alias patterns

| Alias pattern     | Replaced with                                                                                                                                                                                      |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `$m`              | Measurement name.                                                                                                                                                                                  |
| `$measurement`    | Measurement name.                                                                                                                                                                                  |
| `$1` - `$9`       | Part of measurement name (if you separate your measurement name with dots).                                                                                                                        |
| `$col`            | Column name.                                                                                                                                                                                       |
| `$tag_exampletag` | The value of the `exampletag` tag. The syntax is `$tag*yourTagName` and must start with `$tag*`. To use your tag as an alias in the ALIAS BY field, you must use the tag to group by in the query. |

You can also use `[[tag_hostname]]` pattern replacement syntax.

For example, entering the value `Host: [[tag_hostname]]` in the ALIAS BY field replaces it with the `hostname` tag value
for each legend value.
An example legend value would be `Host: server1`.

## SQL query editor

Grafana support [SQL querying language](https://docs.influxdata.com/influxdb/cloud-serverless/query-data/sql/)
with [InfluxDB v3.0](https://www.influxdata.com/blog/introducing-influxdb-3-0/) and higher.

### Macros

You can use macros within the query to replace them with the values from Grafana's context.

| Macro example               | Replaced with                                                                                                                                                                       |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `$__timeFrom`               | The start of the currently active time selection, such as `2020-06-11T13:31:00Z`.                                                                                                   |
| `$__timeTo`                 | The end of the currently active time selection, such as `2020-06-11T14:31:00Z`.                                                                                                     |
| `$__timeFilter`             | The time range that applies the start and the end of currently active time selection.                                                                                               |
| `$__interval`               | An interval string that corresponds to Grafana's calculated interval based on the time range of the active time selection, such as `5s`.                                            |
| `$__dateBin(<column>)`      | Applies [date_bin](https://docs.influxdata.com/influxdb/cloud-serverless/reference/sql/functions/time-and-date/#date_bin) function. Column must be timestamp.                       |
| `$__dateBinAlias(<column>)` | Applies [date_bin](https://docs.influxdata.com/influxdb/cloud-serverless/reference/sql/functions/time-and-date/#date_bin) function with suffix `_binned`. Column must be timestamp. |

Examples:

```
// with macro
1. SELECT * FROM cpu WHERE time >= $__timeFrom AND time <= $__timeTo
2. SELECT * FROM cpu WHERE $__timeFilter(time)
3. SELECT $__dateBin(time) from cpu

// interpolated
1. SELECT * FROM iox.cpu WHERE time >= cast('2023-12-15T12:38:30Z' as timestamp) AND time <= cast('2023-12-15T18:38:30Z' as timestamp)
2. SELECT * FROM cpu WHERE time >= '2023-12-15T12:41:28Z' AND time <= '2023-12-15T18:41:28Z'
3. SELECT date_bin(interval '15 second', time, timestamp '1970-01-01T00:00:00Z') from cpu
```

## Flux query editor

Grafana supports Flux when running InfluxDB v1.8 and higher.
If your data source is [configured for Flux]({{< relref "./#configure-the-data-source" >}}), you can use
the [Flux query and scripting language](https://www.influxdata.com/products/flux/) in the query editor, which serves as
a text editor for raw Flux queries with macro support.

For more information and connection details, refer
to [1.8 compatibility](https://github.com/influxdata/influxdb-client-go/#influxdb-18-api-compatibility).

### Use macros

You can enter macros in the query to replace them with values from Grafana's context.
Macros support copying and pasting from [Chronograf](https://www.influxdata.com/time-series-platform/chronograf/).

| Macro example      | Replaced with                                                                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v.timeRangeStart` | The start of the currently active time selection, such as `2020-06-11T13:31:00Z`.                                                                             |
| `v.timeRangeStop`  | The end of the currently active time selection, such as `2020-06-11T14:31:00Z`.                                                                               |
| `v.windowPeriod`   | An interval string compatible with Flux that corresponds to Grafana's calculated interval based on the time range of the active time selection, such as `5s`. |
| `v.defaultBucket`  | The data source configuration's "Default Bucket" setting.                                                                                                     |
| `v.organization`   | The data source configuration's "Organization" setting.                                                                                                       |

For example, the query editor interpolates this query:

```flux
from(bucket: v.defaultBucket)
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r["_measurement"] == "cpu" or r["_measurement"] == "swap")
  |> filter(fn: (r) => r["_field"] == "usage_system" or r["_field"] == "free")
  |> aggregateWindow(every: v.windowPeriod, fn: mean)
  |> yield(name: "mean")
```

Into this query to send to InfluxDB, with interval and time period values changing according to the active time
selection:

```flux
from(bucket: "grafana")
  |> range(start: 2020-06-11T13:59:07Z, stop: 2020-06-11T14:59:07Z)
  |> filter(fn: (r) => r["_measurement"] == "cpu" or r["_measurement"] == "swap")
  |> filter(fn: (r) => r["_field"] == "usage_system" or r["_field"] == "free")
  |> aggregateWindow(every: 2s, fn: mean)
  |> yield(name: "mean")
```

To view the interpolated version of a query with the query inspector, refer to [Panel Inspector](ref:panel-inspector).

## Query logs

You can query and display log data from InfluxDB in [Explore](ref:explore) and with the [Logs panel](ref:logs) for dashboards.

Select the InfluxDB data source, then enter a query to display your logs.

### Create log queries

The Logs Explorer next to the query field, accessed by the **Measurements/Fields** button, lists measurements and
fields.
Choose the desired measurement that contains your log data, then choose which field to use to display the log message.

Once InfluxDB returns the result, the log panel lists log rows and displays a bar chart, where the x axis represents the
time and the y axis represents the frequency/count.

### Filter search

To add a filter, click the plus icon to the right of the **Measurements/Fields** button, or next to a condition.

To remove tag filters, click the first select, then choose **--remove filter--**.

## Apply annotations

[Annotations][annotate-visualizations] overlay rich event information on top of graphs.
You can add annotation queries in the Dashboard menu's Annotations view.

For InfluxDB, your query **must** include `WHERE $timeFilter`.

If you select only one column, you don't need to enter anything in the column mapping fields.

The **Tags** field's value can be a comma-separated string.

### Annotation query example

```sql
SELECT title, description
from events
WHERE $timeFilter
ORDER BY time ASC
```
