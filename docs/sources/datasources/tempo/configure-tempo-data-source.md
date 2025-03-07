---
description: Guide for configuring Tempo in Grafana
keywords:
  - grafana
  - tempo
  - guide
  - tracing
labels:
  products:
    - cloud
    - enterprise
    - oss
menuTitle: Configure Tempo
title: Configure the Tempo data source
weight: 200
refs:
  data-source-management:
    - pattern: /docs/grafana/
      destination: /docs/grafana/<GRAFANA_VERSION>/administration/data-source-management/
    - pattern: /docs/grafana-cloud/
      destination: /docs/grafana/<GRAFANA_VERSION>/administration/data-source-management/
  configure-grafana-feature-toggles:
    - pattern: /docs/grafana/
      destination: /docs/grafana/<GRAFANA_VERSION>/setup-grafana/configure-grafana/#feature_toggles
    - pattern: /docs/grafana-cloud/
      destination: /docs/grafana/<GRAFANA_VERSION>/setup-grafana/configure-grafana/#feature_toggles
  variable-syntax:
    - pattern: /docs/grafana/
      destination: /docs/grafana/<GRAFANA_VERSION>/dashboards/variables/variable-syntax/
    - pattern: /docs/grafana-cloud/
      destination: /docs/grafana/<GRAFANA_VERSION>/dashboards/variables/variable-syntax/
  exemplars:
    - pattern: /docs/grafana/
      destination: /docs/grafana/<GRAFANA_VERSION>/fundamentals/exemplars/
    - pattern: /docs/grafana-cloud/
      destination: /docs/grafana/<GRAFANA_VERSION>/fundamentals/exemplars/
  build-dashboards:
    - pattern: /docs/grafana/
      destination: /docs/grafana/<GRAFANA_VERSION>/dashboards/build-dashboards/
    - pattern: /docs/grafana-cloud/
      destination: /docs/grafana/<GRAFANA_VERSION>/dashboards/build-dashboards/
  explore:
    - pattern: /docs/grafana/
      destination: /docs/grafana/<GRAFANA_VERSION>/explore/
    - pattern: /docs/grafana-cloud/
      destination: /docs/grafana/<GRAFANA_VERSION>/explore/
  explore-trace-integration:
    - pattern: /docs/grafana/
      destination: /docs/grafana/<GRAFANA_VERSION>/explore/trace-integration/
    - pattern: /docs/grafana-cloud/
      destination: /docs/grafana/<GRAFANA_VERSION>/explore/trace-integration/
  provisioning-data-sources:
    - pattern: /docs/grafana/
      destination: /docs/grafana/<GRAFANA_VERSION>/administration/provisioning/#data-sources
    - pattern: /docs/grafana-cloud/
      destination: /docs/grafana/<GRAFANA_VERSION>/administration/provisioning/#data-sources
  node-graph:
    - pattern: /docs/grafana/
      destination: /docs/grafana/<GRAFANA_VERSION>/panels-visualizations/visualizations/node-graph/
    - pattern: /docs/grafana-cloud/
      destination: /docs/grafana/<GRAFANA_VERSION>/panels-visualizations/visualizations/node-graph/
---

# Configure the Tempo data source

To configure basic settings for the Tempo data source, complete the following steps:

1.  Click **Connections** in the left-side menu.
1.  Under Your connections, click **Data sources**.
1.  Enter `Tempo` in the search bar.
1.  Select **Tempo**.

1.  On the **Settings** tab, set the data source's basic configuration options:

    | Name           | Description                                                              |
    | -------------- | ------------------------------------------------------------------------ |
    | **Name**       | Sets the name you use to refer to the data source in panels and queries. |
    | **Default**    | Sets the data source that's pre-selected for new panels.                 |
    | **URL**        | Sets the URL of the Tempo instance, such as `http://tempo`.              |
    | **Basic Auth** | Enables basic authentication to the Tempo data source.                   |
    | **User**       | Sets the user name for basic authentication.                             |
    | **Password**   | Sets the password for basic authentication.                              |

You can also configure settings specific to the Tempo data source.

This video explains how to add data sources, including Loki, Tempo, and Mimir, to Grafana and Grafana Cloud. Tempo data source set up starts at 4:58 in the video.

{{< youtube id="cqHO0oYW6Ic" start="298" >}}

## Trace to logs

![Trace to logs settings](/media/docs/tempo/tempo-trace-to-logs-9-4.png)

The **Trace to logs** setting configures the [trace to logs feature](ref:explore-trace-integration) that is available when you integrate Grafana with Tempo.

There are two ways to configure the trace to logs feature:

- Use a simplified configuration with default query, or
- Configure a custom query where you can use a [template language](ref:variable-syntax) to interpolate variables from the trace or span.

### Use a simple configuration

1. Select the target data source from the drop-down list.

   You can also click **Open advanced data source picker** to see more options, including adding a data source.

1. Set start and end time shift. As the logs timestamps may not exactly match the timestamps of the spans in trace it may be necessary to search in larger or shifted time range to find the desired logs.
1. Select which tags to use in the logs query. The tags you configure must be present in the span's attributes or resources for a trace to logs span link to appear. You can optionally configure a new name for the tag. This is useful, for example, if the tag has dots in the name and the target data source does not allow using dots in labels. In that case, you can for example remap `http.status` (the span attribute) to `http_status` (the data source field). "Data source" in this context can refer to Loki, or another log data source.
1. Optionally switch on the **Filter by trace ID** and/or **Filter by span ID** setting to further filter the logs if your logs consistently contain trace or span IDs.

### Configure a custom query

1. Select the target data source from the drop-down list.

   You can also click **Open advanced data source picker** to see more options, including adding a data source.

1. Set start and end time shift. As the logs timestamps may not exactly match the timestamps of the spans in the trace it may be necessary to widen or shift the time range to find the desired logs.
1. Optional: Select tags to map. These tags can be used in the custom query with `${__tags}` variable. This variable interpolates the mapped tags as list in an appropriate syntax for the data source. Only the tags that were present in the span are included; tags that aren't present are omitted You can also configure a new name for the tag. This is useful in cases where the tag has dots in the name and the target data source doesn't allow dots in labels. For example, you can remap `http.status` to `http_status`. If you don't map any tags here, you can still use any tag in the query, for example, `method="${__span.tags.method}"`. You can learn more about custom query variables [here](/docs/grafana/latest/datasources/tempo/configure-tempo-data-source/#custom-query-variables).
1. Skip **Filter by trace ID** and **Filter by span ID** settings as these cannot be used with a custom query.
1. Switch on **Use custom query**.
1. Specify a custom query to be used to query the logs. You can use various variables to make that query relevant for current span. The link will only be shown only if all the variables are interpolated with non-empty values to prevent creating an invalid query.

### Configure trace to logs

The following table describes the ways in which you can configure your trace to logs settings:

| Setting name              | Description                                                                                                                                                                                                                                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Data source**           | Defines the target data source. You can select Loki or any compatible log store.                                                                                                                                                                                                                             |
| **Span start time shift** | Shifts the start time for the logs query, based on the span's start time. You can use time units, such as `5s`, `1m`, `3h`. To extend the time to the past, use a negative value. Default: `0`.                                                                                                              |
| **Span end time shift**   | Shifts the end time for the logs query, based on the span's end time. You can use time units. Default: `0`.                                                                                                                                                                                                  |
| **Tags**                  | Defines the tags to use in the logs query. Default: `cluster`, `hostname`, `namespace`, `pod`, `service.name`, `service.namespace`. You can change the tag name for example to remove dots from the name if they are not allowed in the target data source. For example, map `http.status` to `http_status`. |
| **Filter by trace ID**    | Toggles whether to append the trace ID to the logs query.                                                                                                                                                                                                                                                    |
| **Filter by span ID**     | Toggles whether to append the span ID to the logs query.                                                                                                                                                                                                                                                     |
| **Use custom query**      | Toggles use of custom query with interpolation.                                                                                                                                                                                                                                                              |
| **Query**                 | Input to write custom query. Use variable interpolation to customize it with variables from span.                                                                                                                                                                                                            |

## Trace to metrics

{{% admonition type="note" %}}
This feature is behind the `traceToMetrics` [feature toggle](ref:configure-grafana-feature-toggles).
If you use Grafana Cloud, open a [support ticket in the Cloud Portal](/profile/org#support) to access this feature.
{{% /admonition %}}

The **Trace to metrics** setting configures the [trace to metrics feature](/blog/2022/08/18/new-in-grafana-9.1-trace-to-metrics-allows-users-to-navigate-from-a-trace-span-to-a-selected-data-source/) available when integrating Grafana with Tempo.

{{< youtube id="TkapvLeMMpc" >}}

There are two ways to configure the trace to metrics feature:

- Use a basic configuration with a default query, or
- Configure one or more custom queries where you can use a [template language](ref:variable-syntax) to interpolate variables from the trace or span.

### Simple config

To use a simple configuration, follow these steps:

1. Select a metrics data source from the **Data source** drop-down.
1. Optional: Choose any tags to use in the query. If left blank, the default values of `cluster`, `hostname`, `namespace`, `pod`, `service.name` and `service.namespace` are used.

   The tags you configure must be present in the spans attributes or resources for a trace to metrics span link to appear. You can optionally configure a new name for the tag. This is useful for example if the tag has dots in the name and the target data source doesn't allow using dots in labels. In that case you can for example remap `service.name` to `service_name`.

1. Do not select **Add query**.
1. Select **Save and Test**.

### Custom queries

To use custom queriess with the configuration, follow these steps:

1. Select a metrics data source from the **Data source** drop-down.
1. Optional: Choose any tags to use in the query. If left blank, the default values of `cluster`, `hostname`, `namespace`, `pod`, `service.name` and `service.namespace` are used.

   These tags can be used in the custom query with `${__tags}` variable. This variable interpolates the mapped tags as list in an appropriate syntax for the data source and will only include the tags that were present in the span omitting those that weren’t present. You can optionally configure a new name for the tag. This is useful in cases where the tag has dots in the name and the target data source doesn't allow using dots in labels. For example, you can remap `service.name` to `service_name` in such a case. If you don’t map any tags here, you can still use any tag in the query like this `method="${__span.tags.method}"`. You can learn more about custom query variables [here](/docs/grafana/latest/datasources/tempo/configure-tempo-data-source/#custom-query-variables).

1. Click **Add query** to add a custom query.
1. Specify a custom query to be used to query metrics data.

   Each linked query consists of:

   - **Link Label:** _(Optional)_ Descriptive label for the linked query.
   - **Query:** The query ran when navigating from a trace to the metrics data source.
     Interpolate tags using the `$__tags` keyword.
     For example, when you configure the query `requests_total{$__tags}`with the tags `k8s.pod=pod` and `cluster`, the result looks like `requests_total{pod="nginx-554b9", cluster="us-east-1"}`.

1. Select **Save and Test**.

### Configure trace to metrics

| Setting name              | Description                                                                                                                                                                                                                                                     |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Data source**           | Defines the target data source.                                                                                                                                                                                                                                 |
| **Span start time shift** | Shifts the start time for the metrics query, based on the span's start time. You can use time units, such as `5s`, `1m`, `3h`. To extend the time to the past, use a negative value. Default: `0`.                                                              |
| **Span end time shift**   | Shifts the end time for the metrics query, based on the span's end time. You can use time units. Default: `0`.                                                                                                                                                  |
| **Tags**                  | Defines the tags used in linked queries. The key sets the span attribute name, and the optional value sets the corresponding metric label name. For example, you can map `k8s.pod` to `pod`. To interpolate these tags into queries, use the `$__tags` keyword. |
| **Link Label**            | _(Optional)_ Descriptive label for the linked query.                                                                                                                                                                                                            |
| **Query**                 | Input to write a custom query. Use variable interpolation to customize it with variables from span.                                                                                                                                                             |

## Trace to profiles

[//]: # 'Shared content for Trace to profiles in the Tempo data source'

{{< docs/shared source="grafana" lookup="datasources/tempo-traces-to-profiles.md" leveloffset="+1" version="<GRAFANA_VERSION>" >}}

## Custom query variables

To use a variable in your trace to logs, metrics or profiles you need to wrap it in `${}`. For example, `${__span.name}`.

| Variable name          | Description                                                                                                                                                                                                                                                                                                                              |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **\_\_tags**           | This variable uses the tag mapping from the UI to create a label matcher string in the specific data source syntax. The variable only uses tags that are present in the span. The link is still created even if only one of those tags is present in the span. You can use this if all tags are not required for the query to be useful. |
| **\_\_span.spanId**    | The ID of the span.                                                                                                                                                                                                                                                                                                                      |
| **\_\_span.traceId**   | The ID of the trace.                                                                                                                                                                                                                                                                                                                     |
| **\_\_span.duration**  | The duration of the span.                                                                                                                                                                                                                                                                                                                |
| **\_\_span.name**      | Name of the span.                                                                                                                                                                                                                                                                                                                        |
| **\_\_span.tags**      | Namespace for the tags in the span. To access a specific tag named `version`, you would use `${__span.tags.version}`. In case the tag contains dot, you have to access it as `${__span.tags["http.status"]}`.                                                                                                                            |
| **\_\_trace.traceId**  | The ID of the trace.                                                                                                                                                                                                                                                                                                                     |
| **\_\_trace.duration** | The duration of the trace.                                                                                                                                                                                                                                                                                                               |
| **\_\_trace.name**     | The name of the trace.                                                                                                                                                                                                                                                                                                                   |

## Service Graph

The **Service Graph** setting configures the [Service Graph](/docs/tempo/latest/metrics-generator/service_graphs/enable-service-graphs/) feature.

Configure the **Data source** setting to define in which Prometheus instance the Service Graph data is stored.

To use the Service Graph, refer to the [Service Graph documentation](#use-the-service-graph).

## Node Graph

The **Node Graph** setting enables the [node graph visualization](ref:node-graph), which is disabled by default.

Once enabled, Grafana displays the node graph above the trace view.

## Tempo search

The **Search** setting configures [Tempo search](/docs/tempo/latest/configuration/#search).

You can configure the **Hide search** setting to hide the search query option in **Explore** if search is not configured in the Tempo instance.

## Loki search

The **Loki search** setting configures the Loki search query type.

Configure the **Data source** setting to define which Loki instance you want to use to search traces.
You must configure [derived fields]({{< relref "../loki#configure-derived-fields" >}}) in the Loki instance.

## TraceID query

The **TraceID query** setting modifies how TraceID queries are run. The time range can be used when there are performance issues or timeouts since it will narrow down the search to the defined range. This setting is disabled by default.

You can configure this setting as follows:

| Name                  | Description                                                 |
| --------------------- | ----------------------------------------------------------- |
| **Enable time range** | Use a time range in the TraceID query. Default: `disabled`. |
| **Time shift start**  | Time shift for start of search. Default: `30m`.             |
| **Time shift end**    | Time shift for end of search. Default: `30m`.               |

## Span bar

The **Span bar** setting helps you display additional information in the span bar row.

You can choose one of three options:

| Name         | Description                                                                                                                      |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| **None**     | Adds nothing to the span bar row.                                                                                                |
| **Duration** | _(Default)_ Displays the span duration on the span bar row.                                                                      |
| **Tag**      | Displays the span tag on the span bar row. You must also specify which tag key to use to get the tag value, such as `component`. |

## Provision the data source

You can define and configure the Tempo data source in YAML files as part of Grafana's provisioning system.
For more information about provisioning and available configuration options, refer to [Provisioning Grafana](ref:provisioning-data-sources).

Example provision YAML file:

```yaml
apiVersion: 1

datasources:
  - name: Tempo
    type: tempo
    uid: EbPG8fYoz
    url: http://localhost:3200
    access: proxy
    basicAuth: false
    jsonData:
      tracesToLogsV2:
        # Field with an internal link pointing to a logs data source in Grafana.
        # datasourceUid value must match the uid value of the logs data source.
        datasourceUid: 'loki'
        spanStartTimeShift: '-1h'
        spanEndTimeShift: '1h'
        tags: ['job', 'instance', 'pod', 'namespace']
        filterByTraceID: false
        filterBySpanID: false
        customQuery: true
        query: 'method="${__span.tags.method}"'
      tracesToMetrics:
        datasourceUid: 'prom'
        spanStartTimeShift: '1h'
        spanEndTimeShift: '-1h'
        tags: [{ key: 'service.name', value: 'service' }, { key: 'job' }]
        queries:
          - name: 'Sample query'
            query: 'sum(rate(traces_spanmetrics_latency_bucket{$$__tags}[5m]))'
      tracesToProfiles:
        datasourceUid: 'grafana-pyroscope-datasource'
        tags: ['job', 'instance', 'pod', 'namespace']
        profileTypeId: 'process_cpu:cpu:nanoseconds:cpu:nanoseconds'
        customQuery: true
        query: 'method="${__span.tags.method}"'
      serviceMap:
        datasourceUid: 'prometheus'
      nodeGraph:
        enabled: true
      search:
        hide: false
      lokiSearch:
        datasourceUid: 'loki'
      traceQuery:
        timeShiftEnabled: true
        spanStartTimeShift: '1h'
        spanEndTimeShift: '-1h'
      spanBar:
        type: 'Tag'
        tag: 'http.path'
```
