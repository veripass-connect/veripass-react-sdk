import React, { useEffect, useState } from 'react';

import { RetryMessage, Spinner } from '@link-loom/react-sdk';
import { FormControlLabel, Switch } from '@mui/material';
import { InfoOutlined as InfoOutlinedIcon } from '@mui/icons-material';

import EntityDetailShell from '@components/shared/entity-detail-shell/EntityDetailShell.component';
import { buildStatusTag } from '@components/shared/entity-detail-shell/entityDetail.helpers';
import { THEME_COLORS } from '@constants/theme';

import { VeripassUserQuickStandardEdit } from '../edit/VeripassUserQuickStandardEdit.component';
import { VeripassUserQuickStandardPreview } from '../preview/VeripassUserQuickStandardPreview.component';

const VeripassUserQuickStandardManager = ({
  onUpdatedEntity,
  entitySelected,
  setIsOpen,
  isPopupContext,
  mode,
  refreshEntity,
  environment,
  apiKey,
  showFullDetailsLink = true,
  autoSwitchToPreview = false,
  showCloseButton = true,
}) => {
  // UI states
  const [isEditMode, setIsEditMode] = useState(mode === 'edit' ?? false);
  const [entityNotFound, setEntityNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Models
  const [entity, setEntity] = useState(entitySelected);

  const handleEditChange = () => {
    setIsEditMode((prevEditMode) => !prevEditMode);
  };

  const initializeComponent = async (selected) => {
    setEntity(selected);
    setIsLoading(false);
    setEntityNotFound(false);
  };

  const handleUpdatedEntity = (action, payload) => {
    if (action === 'veripass-user-quick-standard::updated' && payload?.result) {
      setEntity(payload.result);
      if (autoSwitchToPreview) {
        setIsEditMode(false);
      }
    }

    if (onUpdatedEntity) {
      onUpdatedEntity(action, payload);
    }
  };

  useEffect(() => {
    // Determine mode based on prop or default (could handle 'preview' explicitly if needed)
    if (mode) {
      setIsEditMode(mode === 'edit');
    }
  }, [mode]);

  useEffect(() => {
    if (entitySelected) {
      initializeComponent(entitySelected);
    }
  }, [entitySelected]);

  // Determine display name (handle nested profile potential manually or rely on entity)
  const displayName = entity?.profile?.display_name || entity?.display_name || 'User';
  const slug = entity?.profile?.username || entity?.username || '';
  const statusTag = buildStatusTag(entity?.status);

  if (isLoading) {
    return <Spinner />;
  }

  if (entityNotFound) {
    return <RetryMessage />;
  }

  const editToggle = (
    <FormControlLabel
      control={
        <Switch checked={isEditMode} onChange={handleEditChange} name="editmode" color="primary" size="small" />
      }
      label="Edit"
      labelPlacement="start"
      sx={{
        mr: 0,
        ml: 1,
        gap: 0.5,
        '& .MuiFormControlLabel-label': { fontSize: '0.82rem', color: THEME_COLORS.textSecondary },
      }}
    />
  );

  const profileTab = isEditMode ? (
    <VeripassUserQuickStandardEdit
      ui={{ showHeader: false }}
      onUpdatedEntity={handleUpdatedEntity}
      entity={entity}
      setIsOpen={setIsOpen}
      isPopupContext={isPopupContext}
      environment={environment}
      apiKey={apiKey}
      showFullDetailsLink={showFullDetailsLink}
    />
  ) : (
    <VeripassUserQuickStandardPreview
      ui={{ showHeader: false }}
      entity={entity}
      setIsOpen={setIsOpen}
      isPopupContext={isPopupContext}
      showCloseButton={showCloseButton}
    />
  );

  return (
    <EntityDetailShell
      breadcrumbSection="Users"
      title={displayName}
      slug={slug}
      tags={statusTag ? [statusTag] : []}
      topBarExtra={editToggle}
      tabs={[
        {
          id: 'profile',
          label: 'Profile',
          icon: <InfoOutlinedIcon sx={{ fontSize: 16 }} />,
          content: profileTab,
        },
      ]}
    />
  );
};

export default VeripassUserQuickStandardManager;
