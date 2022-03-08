package service

import (
	"context"
	"fmt"

	"github.com/grafana/grafana/pkg/bus"
	"github.com/grafana/grafana/pkg/components/simplejson"
	"github.com/grafana/grafana/pkg/infra/log"
	"github.com/grafana/grafana/pkg/models"
	"github.com/grafana/grafana/pkg/plugins"
	"github.com/grafana/grafana/pkg/services/plugindashboards"
)

func ProvideService(bus bus.Bus, pluginDashboardStore plugins.DashboardFileStore) *Service {
	return &Service{
		bus:                  bus,
		pluginDashboardStore: pluginDashboardStore,
		logger:               log.New("plugindashboards"),
	}
}

type Service struct {
	bus                  bus.Bus
	pluginDashboardStore plugins.DashboardFileStore
	logger               log.Logger
}

func (s Service) ListPluginDashboards(ctx context.Context, req *plugindashboards.ListPluginDashboardsRequest) (*plugindashboards.ListPluginDashboardsResponse, error) {
	if req == nil {
		return nil, fmt.Errorf("req cannot be nil")
	}

	listArgs := &plugins.ListPluginDashboardFilesArgs{
		PluginID: req.PluginID,
	}
	listResp, err := s.pluginDashboardStore.ListPluginDashboardFiles(ctx, listArgs)
	if err != nil {
		return nil, err
	}

	result := make([]*plugindashboards.PluginDashboard, 0)

	// load current dashboards
	query := models.GetDashboardsByPluginIdQuery{OrgId: req.OrgID, PluginId: req.PluginID}
	if err := s.bus.Dispatch(ctx, &query); err != nil {
		return nil, err
	}

	existingMatches := make(map[int64]bool)
	for _, reference := range listResp.FileReferences {
		loadReq := &plugindashboards.LoadPluginDashboardRequest{
			PluginID:  req.PluginID,
			Reference: reference,
		}
		loadResp, err := s.LoadPluginDashboard(ctx, loadReq)
		if err != nil {
			return nil, err
		}

		dashboard := loadResp.Dashboard

		res := &plugindashboards.PluginDashboard{}
		res.UID = dashboard.Uid
		res.Reference = reference
		res.PluginId = req.PluginID
		res.Title = dashboard.Title
		res.Revision = dashboard.Data.Get("revision").MustInt64(1)

		// find existing dashboard
		for _, existingDash := range query.Result {
			if existingDash.Slug == dashboard.Slug {
				res.UID = existingDash.Uid
				res.DashboardId = existingDash.Id
				res.Imported = true
				res.ImportedUri = "db/" + existingDash.Slug
				res.ImportedUrl = existingDash.GetUrl()
				res.ImportedRevision = existingDash.Data.Get("revision").MustInt64(1)
				existingMatches[existingDash.Id] = true
			}
		}

		result = append(result, res)
	}

	// find deleted dashboards
	for _, dash := range query.Result {
		if _, exists := existingMatches[dash.Id]; !exists {
			result = append(result, &plugindashboards.PluginDashboard{
				UID:         dash.Uid,
				Slug:        dash.Slug,
				DashboardId: dash.Id,
				Removed:     true,
			})
		}
	}

	return &plugindashboards.ListPluginDashboardsResponse{
		Items: result,
	}, nil
}

func (s Service) LoadPluginDashboard(ctx context.Context, req *plugindashboards.LoadPluginDashboardRequest) (*plugindashboards.LoadPluginDashboardResponse, error) {
	if req == nil {
		return nil, fmt.Errorf("req cannot be nil")
	}

	args := &plugins.GetPluginDashboardFileContentArgs{
		PluginID:      req.PluginID,
		FileReference: req.Reference,
	}
	resp, err := s.pluginDashboardStore.GetPluginDashboardFileContent(ctx, args)
	if err != nil {
		return nil, err
	}

	defer func() {
		if err := resp.Content.Close(); err != nil {
			s.logger.Warn("Failed to close plugin dashboard file", "reference", req.Reference, "err", err)
		}
	}()

	data, err := simplejson.NewFromReader(resp.Content)
	if err != nil {
		return nil, err
	}

	return &plugindashboards.LoadPluginDashboardResponse{
		Dashboard: models.NewDashboardFromJson(data),
	}, nil
}

var _ plugindashboards.Service = &Service{}
