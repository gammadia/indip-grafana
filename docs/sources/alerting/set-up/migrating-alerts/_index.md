---
aliases:
  - ../migrating-alerts/ # /docs/grafana/<GRAFANA_VERSION>/alerting/migrating-alerts/
canonical: https://grafana.com/docs/grafana/latest/alerting/set-up/migrating-alerts/
description: Upgrade to Grafana Alerting
labels:
  products:
    - enterprise
    - oss
title: Upgrade Alerting
weight: 150
refs:
  alerting_config_error_handling:
    - pattern: /docs/grafana/
      destination: /docs/grafana/<GRAFANA_VERSION>/alerting/alerting-rules/create-grafana-managed-rule/#configure-no-data-and-error-handling
    - pattern: /docs/grafana-cloud/
      destination: /docs/grafana-cloud/alerting-and-irm/alerting/alerting-rules/create-grafana-managed-rule/#configure-no-data-and-error-handling
  special_alert:
    - pattern: /docs/grafana/
      destination: /docs/grafana/<GRAFANA_VERSION>/alerting/fundamentals/alert-rules/state-and-health/#special-alerts-for-nodata-and-error
    - pattern: /docs/grafana-cloud/
      destination: /docs/grafana-cloud/alerting-and-irm/alerting/fundamentals/alert-rules/state-and-health/#special-alerts-for-nodata-and-error
---

# Upgrade Alerting

{{% admonition type="warning" %}}
Legacy alerting will be removed in Grafana v11.0.0. Grafana v10.4 is the last version that offers legacy alerting and the last version of Grafana where automatic alert upgrades will be available.

Installing Grafana 11 before upgrading your legacy alerts will result in your existing alerts becoming inaccessible or lost.

For more information, refer to [Legacy alerting removal: What you need to know about upgrading to Grafana Alerting](https://grafana.com/blog/2024/04/04/legacy-alerting-removal-what-you-need-to-know-about-upgrading-to-grafana-alerting/).
{{% /admonition %}}

## What happens if I don’t upgrade from legacy alerting to Grafana Alerting before installing Grafana 11?

Attempting to upgrade to Grafana 11 while still having [legacy alerting explicitly enabled]({{< relref "#rolling-back-to-legacy-alerting" >}}) will result in Grafana not starting and an error message informing you to either:

1. Downgrade to a version prior to Grafana 11 and then upgrade from legacy alerting to Grafana Alerting using one of the below [upgrade methods]({{< relref "#upgrade-methods" >}}).
2. Confirm that you don't intend to upgrade your legacy alerts by [disabling legacy alerting]({{< relref "#enable-grafana-alerting" >}}) (optionally enable Grafana Alerting) in your configuration file.

{{% admonition type="note" %}}
Confirming that you don't intend to upgrade your legacy alerts and continuing the Grafana 11 installation may result in your legacy alerts becoming inaccessible or lost.

Grafana will start with a blank alerting slate and you will need to recreate your alerts from scratch. The below automatic upgrade methods will not be available in Grafana 11.

As of v11.0, a rolling back to v10.4 will likely restore your legacy alerts. However, this is not guaranteed to always remain the case in future versions.
{{% /admonition %}}

## Upgrade methods

Grafana provides two methods for a seamless automatic upgrade of legacy alert rules and notification channels to Grafana Alerting:

1. **Upgrade with Preview** (Recommended): Offers a safe and controlled preview environment where you can review and adjust your upgraded alerts before fully enabling Grafana Alerting.
2. **Simple Upgrade**: One-step upgrade method for specific needs where a preview environment is not essential.

### Key Considerations

| Feature                     | Upgrade with Preview                                                                | Simple Upgrade                                       |
| --------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------- |
| **Safety and Control**      | ☑️ Preview environment for review and adjustment                                    | ❌ No preview, potential for unexpected issues       |
| **User Experience**         | ☑️ Seamless transition by handling issues early                                     | ❌ Possible disruption during upgrade                |
| **Granular Control**        | ☑️ Re-upgrade specific resources after resolving errors                             | ❌ All or nothing upgrade, manual error correction   |
| **Stakeholder Involvement** | ☑️ Collaboration and review of adjusted alerts                                      | ❌ Review only available after upgrade               |
| **Provisioning Support**    | ☑️ Configure new as-code before upgrading, simultaneous provisioning                | ❌ No built-in provisioning support                  |
| **Simplicity**              | ❌ May take longer to complete                                                      | ☑️ Fast, one-step process                            |
| **Suited for:**             | ☑️ Complex setups, risk-averse environments, collaborative teams, heavy as-code use | ☑️ Simple setups, testing environments, large fleets |
| **Version**                 | Grafana v10.3.0 -> v10.4.x                                                          | Grafana v9.0.0 -> v10.4.x                            |

{{% admonition type="note" %}}
When upgrading with either method, your legacy dashboard alerts and notification channels are copied to a new format. This is non-destructive and can be [rolled back easily]({{< relref "#rolling-back-to-legacy-alerting" >}}).
{{% /admonition %}}

## Upgrade with Preview (Recommended)

### Prerequisites

- Grafana `v10.3.0 or later`.
- Grafana administrator access.
- Enable `alertingPreviewUpgrade` [feature toggle]({{< relref "../../../setup-grafana/configure-grafana/feature-toggles" >}}) (enabled by default in v10.4.0 or later).

### Suited for

- **Complex setups**: Large deployments with intricate alert rules and notification channels.
- **Risk-averse environments**: Situations where minimizing disruption and ensuring a smooth transition are critical.
- **Collaborative teams**: Projects where feedback and review from stakeholders are valuable.
- **Heavy as-code use**: Deployments with large or complex as-code configurations.

### Overview

In **Alerts & IRM**, the **Alerting** section provides a preview of Grafana Alerting where you can review and modify your upgraded alerts before finalizing the upgrade.

In the **Alerting (legacy) -> Alerting upgrade** section, you can upgrade your existing alert rules and notification channels, and view a summary of the upgrade to Grafana Alerting.

Finalize your upgrade by restarting Grafana with the `[unified_alerting]` section enabled in your configuration.

{{% admonition type="note" %}}
Alerts generated by the new alerting system are visible in the **Alerting** section of the navigation panel but are not active until the upgrade is finalized.
{{% /admonition %}}

### To upgrade with preview, complete the following steps.

1. **Preview the Upgrade**:
   - **Initiate the process**: Access the upgrade functionality within Grafana by visiting the **Alerting upgrade** page in the **Alerting (legacy)** section of the navigation panel. From this page you can upgrade your existing alert rules and notification channels to the new Grafana Alerting system.
   - **Review the summary table:** Review the detailed table outlining how your existing alert rules and notification channels were upgraded to resources in the new Grafana Alerting system.
1. **Investigate and Resolve Errors**:
   - **Identify errors**: Carefully examine the previewed upgrade:
     - Any alert rules or notification channels that couldn't be automatically upgraded will be highlighted with error indicators.
     - New or removed alert rules and notification channels will be highlighted with warning indicators.
   - **Address errors**: You have two options to resolve these issues:
     - **Fix legacy issues**: If possible, address the problems within your legacy alerting setup and attempt to upgrade the specific resource again.
     - **Create new resources**: If fixing legacy issues isn't viable, create new alert rules, notification policies, or contact points manually within the new Grafana Alerting system to replace the problematic ones.
1. **Update As-Code Setup** (Optional):
   - **Export upgraded resources**: If you use provisioning methods to manage alert rules and notification channels, you can export the upgraded versions to generate provisioning files compatible with Grafana Alerting.
   - **Test new provisioning definitions**: Ensure your as-code setup aligns with the new system before completing the upgrade process. Both legacy and Grafana Alerting alerts can be provisioned simultaneously to facilitate a smooth transition.
1. **Finalize the Upgrade**:
   - **Contact your Grafana server administrator**: Once you're confident in the state of your previewed upgrade, request to [enable Grafana Alerting]({{< relref "#enable-grafana-alerting" >}}).
   - **Continued use for upgraded organizations**: Organizations that have already completed the preview upgrade will seamlessly continue using their configured setup.
   - **Automatic upgrade for others**: Organizations that haven't initiated the upgrade with preview process will undergo the traditional automatic upgrade during this restart.
   - **Address issues before restart**: Exercise caution, as Grafana will not start if any traditional automatic upgrades encounter errors. Ensure all potential issues are resolved before initiating this step.

## Simple Upgrade

### Prerequisites

- Grafana `v9.0.0 or later` (more recent versions are recommended).

### Suited for

- **Simple setups**: Limited number of alerts and channels with minimal complexity.
- **Testing environments**: Where a quick upgrade without a preview is sufficient.
- **Large fleets**: Where manually reviewing each instance is not feasible.

### Overview

While we recommend the **Upgrade with Preview** method for its enhanced safety and control, the **Simple Upgrade Method** exists for specific situations where a preview environment is not essential. For example, if you have a large fleet of Grafana instances and want to upgrade them all without the need to review and adjust each one individually.

Configure your Grafana instance to enable Grafana Alerting and disable legacy alerting. Then restart Grafana to automatically upgrade your existing alert rules and notification channels to the new Grafana Alerting system.

Once Grafana Alerting is enabled, you can review and adjust your upgraded alerts in the **Alerting** section of the navigation panel as well as export them for as-code setup.

### To perform the simple upgrade, complete the following steps.

{{% admonition type="note" %}}
Any errors encountered during the upgrade process will fail the upgrade and prevent Grafana from starting. If this occurs, you can [roll back to legacy alerting]({{< relref "#rolling-back-to-legacy-alerting" >}}).
{{% /admonition %}}

1. **Upgrade to Grafana Alerting**:
   - **Enable Grafana Alerting**: [Modify custom configuration file]({{< relref "#enable-grafana-alerting" >}}).
   - **Restart Grafana**: Restart Grafana for the configuration changes to take effect. Grafana will automatically upgrade your existing alert rules and notification channels to the new Grafana Alerting system.
1. **Review and Adjust Upgraded Alerts**:
   - **Review the upgraded alerts**: Go to the `Alerting` section of the navigation panel to review the upgraded alerts.
   - **Export upgraded resources**: If you use provisioning methods to manage alert rules and notification channels, you can export the upgraded versions to generate provisioning files compatible with Grafana Alerting.

## Additional Information

### Enable Grafana Alerting

Go to your custom configuration file ($WORKING_DIR/conf/custom.ini) and enter the following in your configuration:

```toml
[alerting]
enabled = false

[unified_alerting]
enabled = true
```

{{% admonition type="note" %}}
If you have existing legacy alerts we advise using the [Upgrade with Preview]({{< relref "#upgrade-with-preview-recommended" >}}) method first to ensure a smooth transition. Any organizations that have not completed the preview upgrade will automatically undergo the simple upgrade during the next restart.
{{% /admonition %}}

### Rolling back to legacy alerting

{{% admonition type="note" %}}
For Grafana Cloud, contact customer support to enable or disable Grafana Alerting for your stack.
{{% /admonition %}}

If you have upgraded to Grafana Alerting and want to roll back to legacy alerting, you can do so by disabling Grafana Alerting and re-enabling legacy alerting.

Go to your custom configuration file ($WORKING_DIR/conf/custom.ini) and enter the following in your configuration:

```toml
[alerting]
enabled = true

[unified_alerting]
enabled = false
```

This action is non-destructive. You can seamlessly switch between legacy alerting and Grafana Alerting at any time without losing any data. However, the upgrade process will only be performed once. If you have opted out of Grafana Alerting and then opt in again, Grafana will not perform the upgrade again.

If, after rolling back, you wish to delete any existing Grafana Alerting configuration and upgrade your legacy alerting configuration again from scratch, you can enable the `clean_upgrade` option:

```toml
[unified_alerting.upgrade]
clean_upgrade = true
```

### Differences and limitations

There are some differences between Grafana Alerting and legacy dashboard alerts, and a number of features that are no longer supported.

**Differences**

1. Read and write access to legacy dashboard alerts are governed by the dashboard permissions (including the inherited permissions from the folder) while Grafana alerts are governed by the permissions of the folder only. During the upgrade, an alert rule might be moved to a different folder to match the permissions of the dashboard. The following rules apply:

   - If the inherited dashboard permissions are different from the permissions of the folder, then the rule is moved to a new folder named after the original: `<Original folder name> - <Permission Hash>`.
   - If the inherited dashboard permissions are the same as the permissions of the folder, then the rule is moved to the original folder.
   - If the dashboard is in the `General` or `Dashboards` folder (i.e. no folder), then the rule is moved to a new `General Alerting - <Permission Hash>` folder.

{{% admonition type="note" %}}
When updating your as-code provisioning setup for Grafana Alerting, newly generated folders will have a different UID from their original.
{{% /admonition %}}

1. `NoData` and `Error` settings are upgraded as is to the corresponding settings in Grafana Alerting, except in two situations:

   - As there is no `Keep Last State` option in Grafana Alerting, this option becomes either [`NoData` or `Error`](ref:alerting_config_error_handling). If using the `Simple Upgrade Method` Grafana automatically creates a 1 year silence for each alert rule with this configuration. If the alert evaluation returns no data or fails (error or timeout), then it creates a [special alert](ref:special_alert), which will be silenced by the silence created during the upgrade.
   - Due to lack of validation, legacy alert rules imported via JSON or provisioned along with dashboards can contain arbitrary values for [`NoData` or `Error`](ref:alerting_config_error_handling). In this situation, Grafana will use the default setting: `NoData` for No data, and `Error` for Error.

1. Notification channels are upgraded to an Alertmanager configuration with the appropriate routes and receivers.

1. Unlike legacy dashboard alerts where images in notifications are enabled per contact point, images in notifications for Grafana Alerting must be enabled in the Grafana configuration, either in the configuration file or environment variables, and are enabled for either all or no contact points.

1. The JSON format for webhook notifications has changed in Grafana Alerting and uses the format from [Prometheus Alertmanager](https://prometheus.io/docs/alerting/latest/configuration/#webhook_config).

1. Alerting on Prometheus `Both` type queries is not supported in Grafana Alerting. Existing legacy alerts with `Both` type queries are upgraded to Grafana Alerting as alerts with `Range` type queries.

**Limitations**

1. Since `Hipchat` and `Sensu` notification channels are no longer supported, legacy alerts associated with these channels are not automatically upgraded to Grafana Alerting. Assign the legacy alerts to a supported notification channel so that you continue to receive notifications for those alerts.
