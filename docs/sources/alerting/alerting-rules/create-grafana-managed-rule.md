---
aliases:
  - ../unified-alerting/alerting-rules/create-grafana-managed-rule/
canonical: https://grafana.com/docs/grafana/latest/alerting/alerting-rules/create-grafana-managed-rule/
description: Configure Grafana-managed alert rules to create alerts that can act on data from any of our supported data sources
keywords:
  - grafana
  - alerting
  - guide
  - rules
  - create
  - grafana-managed
  - data source-managed
labels:
  products:
    - cloud
    - enterprise
    - oss
title: Configure Grafana-managed alert rules
weight: 100
refs:
  alerting-on-numeric-data:
    - pattern: /docs/grafana/
      destination: /docs/grafana/<GRAFANA_VERSION>/alerting/fundamentals/evaluate-grafana-alerts/#alerting-on-numeric-data-1
    - pattern: /docs/grafana-cloud/
      destination: /docs/grafana-cloud/alerting-and-irm/alerting/fundamentals/evaluate-grafana-alerts/#alerting-on-numeric-data-1
  time-units-and-relative-ranges:
    - pattern: /docs/grafana/
      destination: /docs/grafana/<GRAFANA_VERSION>/dashboards/use-dashboards/#time-units-and-relative-ranges
    - pattern: /docs/grafana-cloud/
      destination: /docs/grafana/<GRAFANA_VERSION>/dashboards/use-dashboards/#time-units-and-relative-ranges
  add-a-query:
    - pattern: /docs/grafana/
      destination: /docs/grafana/<GRAFANA_VERSION>/panels-visualizations/query-transform-data/#add-a-query
    - pattern: /docs/grafana-cloud/
      destination: /docs/grafana/<GRAFANA_VERSION>/panels-visualizations/query-transform-data/#add-a-query
  expression-queries:
    - pattern: /docs/grafana/
      destination: /docs/grafana/<GRAFANA_VERSION>/panels-visualizations/query-transform-data/expression-queries/
    - pattern: /docs/grafana-cloud/
      destination: /docs/grafana/<GRAFANA_VERSION>/panels-visualizations/query-transform-data/expression-queries/
  annotation-label:
    - pattern: /docs/grafana/
      destination: /docs/grafana/<GRAFANA_VERSION>/alerting/fundamentals/annotation-label/
    - pattern: /docs/grafana-cloud/
      destination: /docs/grafana-cloud/alerting-and-irm/alerting/fundamentals/annotation-label/
  fundamentals:
    - pattern: /docs/grafana/
      destination: /docs/grafana/<GRAFANA_VERSION>/alerting/fundamentals/
    - pattern: /docs/grafana-cloud/
      destination: /docs/grafana-cloud/alerting-and-irm/alerting/fundamentals/
---

# Configure Grafana-managed alert rules

Grafana-managed rules are the most flexible alert rule type. They allow you to create alerts that can act on data from any of our supported data sources. In addition to supporting multiple data sources, you can also add expressions to transform your data and set alert conditions. Using images in alert notifications is also supported. This is the only type of rule that allows alerting from multiple data sources in a single rule definition.

Multiple alert instances can be created as a result of one alert rule (also known as a multi-dimensional alerting).

{{% admonition type="note" %}}
For Grafana Cloud, there are limits on how many Grafana-managed alert rules you can create. These are as follows:

- Free: 100 alert rules
- Paid: 2000 alert rules
  {{% /admonition %}}

Grafana managed alert rules can only be edited or deleted by users with Edit permissions for the folder storing the rules.

If you delete an alerting resource created in the UI, you can no longer retrieve it.
To make a backup of your configuration and to be able to restore deleted alerting resources, create your alerting resources using file provisioning, Terraform, or the Alerting API.

Watch this video to learn more about creating alert rules: {{< vimeo 720001934 >}}

In the following sections, we’ll guide you through the process of creating your Grafana-managed alert rules.

To create a Grafana-managed alert rule, use the in-product alert creation flow and follow these steps to help you.

## Set alert rule name

1. Click **Alerts & IRM** -> **Alert rules** -> **+ New alert rule**.
1. Enter a name to identify your alert rule.

   This name is displayed in the alert rule list. It is also the `alertname` label for every alert instance that is created from this rule.

## Define query and condition

Define a query to get the data you want to measure and a condition that needs to be met before an alert rule fires.

1. Select a data source.
1. From the **Options** dropdown, specify a [time range](ref:time-units-and-relative-ranges).

   **Note:**

   Grafana Alerting only supports fixed relative time ranges, for example, `now-24hr: now`.

   It does not support absolute time ranges: `2021-12-02 00:00:00 to 2021-12-05 23:59:592` or semi-relative time ranges: `now/d to: now`.

1. Add a query.

   To add multiple [queries](ref:add-a-query), click **Add query**.

   All alert rules are managed by Grafana by default. If you want to switch to a data source-managed alert rule, click **Switch to data source-managed alert rule**.

1. Add one or more [expressions](ref:expression-queries).

   a. For each expression, select either **Classic condition** to create a single alert rule, or choose from the **Math**, **Reduce**, and **Resample** options to generate separate alert for each series.

   {{% admonition type="note" %}}
   When using Prometheus, you can use an instant vector and built-in functions, so you don't need to add additional expressions.
   {{% /admonition %}}

   b. Click **Preview** to verify that the expression is successful.

{{% admonition type="note" %}}
The recovery threshold feature is currently only available in OSS.
{{% /admonition %}}

1. To add a recovery threshold, turn the **Custom recovery threshold** toggle on and fill in a value for when your alert rule should stop firing.

   You can only add one recovery threshold in a query and it must be the alert condition.

1. Click **Set as alert condition** on the query or expression you want to set as your alert condition.

## Set alert evaluation behavior

Use alert rule evaluation to determine how frequently an alert rule should be evaluated and how quickly it should change its state.

To do this, you need to make sure that your alert rule is in the right evaluation group and set a pending period time that works best for your use case.

1. Select a folder or click **+ New folder**.
1. Select an evaluation group or click **+ New evaluation group**.

   If you are creating a new evaluation group, specify the interval for the group.

   All rules within the same group are evaluated concurrently over the same time interval.

1. Enter a pending period.

   The pending period is the period in which an alert rule can be in breach of the condition until it fires.

   Once a condition is met, the alert goes into the **Pending** state. If the condition remains active for the duration specified, the alert transitions to the **Firing** state, else it reverts to the **Normal** state.

1. Turn on pause alert notifications, if required.

   **Note**:

   Pause alert rule evaluation to prevent noisy alerting while tuning your alerts. Pausing stops alert rule evaluation and does not create any alert instances. This is different to mute timings, which stop notifications from being delivered, but still allow for alert rule evaluation and the creation of alert instances.

   You can pause alert rule evaluation to prevent noisy alerting while tuning your alerts. Pausing stops alert rule evaluation and does not create any alert instances. This is different to mute timings, which stop notifications from being delivered, but still allow for alert rule evaluation and the creation of alert instances.

1. In **Configure no data and error handling**, configure alerting behavior in the absence of data.

   Use the guidelines in [No data and error handling](#configure-no-data-and-error-handling).

## Configure notifications

{{< admonition type="note" >}}
To try out a simplified version of routing your alerts, enable the alertingSimplifiedRouting feature toggle and refer to the following section Configure notifications (simplified).
{{< /admonition >}}

1. Add labels to your alert rules to set which notification policy should handle your firing alert instances.

   All alert rules and instances, irrespective of their labels, match the default notification policy. If there are no nested policies, or no nested policies match the labels in the alert rule or alert instance, then the default notification policy is the matching policy.

   Add labels if you want to change the way your notifications are routed.

   Add custom labels by selecting existing key-value pairs from the drop down, or add new labels by entering the new key or value.

1. Preview your alert instance routing set up.

   Based on the labels added, alert instances are routed to the following notification policies displayed.

   Expand each notification policy below to view more details.

1. Click See details to view alert routing details and an email preview.

1. Click **Save rule**.

## Configure notifications (simplified)

{{< admonition type="note" >}}
To try this out, enable the alertingSimplifiedRouting feature toggle.

This feature is currently not available for Grafana Cloud.
{{< /admonition >}}

In the **Labels** section, you can optionally choose whether to add labels to organize your alert rules, make searching easier, as well as set which notification policy should handle your firing alert instance.

In the **Configure notifications** section, you can choose to select a contact point directly from the alert rule form or choose to use notification policy routing as well as set up mute timings and groupings.

Complete the following steps to set up labels and notifications.

1. Add labels, if required.

   Add custom labels by selecting existing key-value pairs from the drop down, or add new labels by entering the new key or value.

2. Configure who receives a notification when an alert rule fires by either choosing **Select contact point** or **Use notification policy**.

   **Select contact point**

   1. Choose this option to select an existing contact point.

      All notifications for this alert rule are sent to this contact point automatically and notification policies are not used.

   2. You can also optionally select a mute timing as well as groupings and timings to define when not to send notifications.

      {{% admonition type="note" %}}
      An auto-generated notification policy is generated. Only admins can view these auto-generated policies from the **Notification policies** list view. Any changes have to be made in the alert rules form. {{% /admonition %}}

   **Use notification policy**

   3. Choose this option to use the notification policy tree to direct your notifications.

      {{% admonition type="note" %}}
      All alert rules and instances, irrespective of their labels, match the default notification policy. If there are no nested policies, or no nested policies match the labels in the alert rule or alert instance, then the default notification policy is the matching policy.
      {{% /admonition %}}

   4. Preview your alert instance routing set up.

      Based on the labels added, alert instances are routed to the following notification policies displayed.

   5. Expand each notification policy below to view more details.

   6. Click **See details** to view alert routing details and an email preview.

## Add annotations

Add [annotations](ref:annotation-label). to provide more context on the alert in your alert notification message.

Annotations add metadata to provide more information on the alert in your alert notification message. For example, add a **Summary** annotation to tell you which value caused the alert to fire or which server it happened on.

1. Optional: Add a summary.

   Short summary of what happened and why.

1. Optional: Add a description.

   Description of what the alert rule does.

1. Optional: Add a Runbook URL.

   Webpage where you keep your runbook for the alert

1. Optional: Add a custom annotation
1. Optional: Add a dashboard and panel link.

   Links alerts to panels in a dashboard.

1. Click **Save rule**.

### Single and multi-dimensional rule

For Grafana managed alerts, you can create a rule with a classic condition or you can create a multi-dimensional rule.

**Rule with classic condition**

Use the classic condition expression to create a rule that triggers a single alert when its condition is met. For a query that returns multiple series, Grafana does not track the alert state of each series. As a result, Grafana sends only a single alert even when alert conditions are met for multiple series.

For more information, see [expressions documentation](ref:expression-queries).

**Multi-dimensional rule**

To generate a separate alert for each series, create a multi-dimensional rule. Use `Math`, `Reduce`, or `Resample` expressions to create a multi-dimensional rule. For example:

- Add a `Reduce` expression for each query to aggregate values in the selected time range into a single value. (Not needed for [rules using numeric data](ref:alerting-on-numeric-data).
- Add a `Math` expression with the condition for the rule. Not needed in case a query or a reduce expression already returns 0 if rule should not fire, or a positive number if it should fire. Some examples: `$B > 70` if it should fire in case value of B query/expression is more than 70. `$B < $C * 100` in case it should fire if value of B is less than value of C multiplied by 100. If queries being compared have multiple series in their results, series from different queries are matched if they have the same labels or one is a subset of the other.

![Query section multi dimensional](/static/img/docs/alerting/unified/rule-edit-multi-8-0.png 'Query section multi dimensional screenshot')

> **Note:** Grafana does not support alert queries with template variables. More information is available at <https://community.grafana.com/t/template-variables-are-not-supported-in-alert-queries-while-setting-up-alert/2514>.

### Configure no data and error handling

Configure alerting behavior when your alert rule evaluation returns no data or an error.

**Note:** Alert rules that are configured to fire when an evaluation returns no data or error only fire when the entire duration of the evaluation period has finished. This means that rather than immediately firing when the alert rule condition is breached, the alert rule waits until the time set as the **For** field has finished and then fires, reducing alert noise and allowing for temporary data availability issues.

If your alert rule evaluation returns no data, you can set the state on your alert rule to appear as follows:

| No Data  | Description                                                                                                                                |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| No Data  | Creates a new alert `DatasourceNoData` with the name and UID of the alert rule, and UID of the datasource that returned no data as labels. |
| Alerting | Sets alert rule state to `Alerting`. The alert rule waits until the time set in the **For** field has finished before firing.              |
| Ok       | Sets alert rule state to `Normal`.                                                                                                         |

If your evaluation returns an error, you can set the state on your alert rule to appear as follows:

| Error    | Description                                                                                                                                     |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Error    | Creates an alert instance `DatasourceError` with the name and UID of the alert rule, and UID of the datasource that returned no data as labels. |
| Alerting | Sets alert rule state to `Alerting`. The alert rule waits until the time set in the **For** field has finished before firing.                   |
| Ok       | Sets alert rule state to `Normal`.                                                                                                              |

### Resolve stale alert instances

An alert instance is considered stale if its dimension or series has disappeared from the query results entirely for two evaluation intervals.

Stale alert instances that are in the **Alerting**/**NoData**/**Error** states are automatically marked as **Resolved** and the grafana_state_reason annotation is added to the alert instance with the reason **MissingSeries**.

### Create alerts from panels

Create alerts from any panel type. This means you can reuse the queries in the panel and create alerts based on them.

1. Navigate to a dashboard in the **Dashboards** section.
2. In the top right corner of the panel, click on the three dots (ellipses).
3. From the dropdown menu, select **More...** and then choose **New alert rule**.

This will open the alert rule form, allowing you to configure and create your alert based on the current panel's query.
