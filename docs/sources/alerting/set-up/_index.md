---
aliases:
  - unified-alerting/set-up/
canonical: https://grafana.com/docs/grafana/latest/alerting/set-up/
description: Set up or upgrade your implementation of Grafana Alerting
labels:
  products:
    - oss
menuTitle: Set up
title: Set up Alerting
weight: 110
refs:
  configure-alertmanager:
    - pattern: /docs/grafana/
      destination: /docs/grafana/<GRAFANA_VERSION>/alerting/set-up/configure-alertmanager/
    - pattern: /docs/grafana-cloud/
      destination: /docs/grafana-cloud/alerting-and-irm/alerting/set-up/configure-alertmanager/
  data-source-alerting:
    - pattern: /docs/grafana/
      destination: /docs/grafana/<GRAFANA_VERSION>/alerting/fundamentals/data-source-alerting/
    - pattern: /docs/grafana-cloud/
      destination: /docs/grafana-cloud/alerting-and-irm/alerting/fundamentals/data-source-alerting/
  terraform-provisioning:
    - pattern: /docs/grafana/
      destination: /docs/grafana/<GRAFANA_VERSION>/alerting/set-up/provision-alerting-resources/terraform-provisioning/
    - pattern: /docs/grafana-cloud/
      destination: /docs/grafana-cloud/alerting-and-irm/alerting/set-up/provision-alerting-resources/terraform-provisioning/
  data-source-management:
    - pattern: /docs/grafana/
      destination: /docs/grafana/<GRAFANA_VERSION>/administration/data-source-management/
    - pattern: /docs/grafana-cloud/
      destination: /docs/grafana/<GRAFANA_VERSION>/administration/data-source-management/
  configure-high-availability:
    - pattern: /docs/grafana/
      destination: /docs/grafana/<GRAFANA_VERSION>/alerting/set-up/configure-high-availability/
    - pattern: /docs/grafana-cloud/
      destination: /docs/grafana-cloud/alerting-and-irm/alerting/set-up/configure-high-availability/
---

# Set up Alerting

Set up or upgrade your implementation of Grafana Alerting.

**Note:**

These are set-up instructions for Grafana Alerting Open Source.

## Before you begin

- Configure your [data sources](ref:data-source-management)
- Check which data sources are compatible with and supported by [Grafana Alerting](ref:data-source-alerting)

Watch this short video to get started.
{{< youtube id="6W8Nu4b_PXM" >}}

## Set up Alerting

To set up Alerting, you need to:

1. Configure alert rules

   - Create Grafana-managed or Mimir/Loki-managed alert rules and recording rules

1. Configure contact points

   - Check the default contact point and update the email address

   - Optional: Add new contact points and integrations

1. Configure notification policies

   - Check the default notification policy

   - Optional: Add additional nested policies

   - Optional: Add labels and label matchers to control alert routing

1. Optional: Integrate with [Grafana OnCall](/docs/oncall/latest/integrations/grafana-alerting)

## Advanced set up options

Grafana Alerting supports many additional configuration options, from configuring external Alertmanagers to routing Grafana-managed alerts outside of Grafana, to defining your alerting setup as code.

The following topics provide you with advanced configuration options for Grafana Alerting.

- [Provision alert rules using file provisioning](/docs/grafana/<GRAFANA_VERSION>/alerting/set-up/provision-alerting-resources/file-provisioning)
- [Provision alert rules using Terraform](ref:terraform-provisioning)
- [Add an external Alertmanager](ref:configure-alertmanager)
- [Configure high availability](ref:configure-high-availability)
