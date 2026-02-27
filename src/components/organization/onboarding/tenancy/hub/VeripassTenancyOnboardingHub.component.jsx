import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import styled from 'styled-components';
import { VeripassSelectableCard } from '../shared/VeripassSelectableCard.component';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';

import { VeripassActionButton } from '@components/shared/buttons/VeripassActionButton.component';

const ViewTitle = styled('h3')({
  fontSize: '2rem',
  color: '#0f172a!important',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
});

const ViewSubtitle = styled('p')({
  fontSize: '1.05rem',
  color: '#64748b',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
});

const NAMESPACE = 'veripass-tenancy-onboarding';
const ACTIONS = {
  HUB_ACTION_CHANGED: `${NAMESPACE}::hub/action-changed`,
  HUB_CONTINUE: `${NAMESPACE}::hub/continue`,
};

function VeripassTenancyOnboardingHubComponent({
  ui = {},
  organization = {},
  selectedAction: initialSelectedAction = 'create-organization',
  itemOnAction,
  updateOnAction,
  environment = 'production',
  apiKey = '',
}) {
  // Hooks
  // ...

  // Models
  // ...

  // UI states
  const [selectedAction, setSelectedAction] = useState(initialSelectedAction || 'create-organization');
  const copy = ui.copy || {};

  // Configs
  // ...

  // Component Functions
  useEffect(() => {
    if (initialSelectedAction) {
      setSelectedAction(initialSelectedAction);
    }
  }, [initialSelectedAction]);

  const handleSelection = (action) => {
    setSelectedAction(action);
    if (updateOnAction) {
      updateOnAction({
        action: ACTIONS.HUB_ACTION_CHANGED,
        namespace: NAMESPACE,
        payload: { selectedAction: action },
      });
    }
  };

  const handleContinue = () => {
    if (itemOnAction) {
      itemOnAction({
        action: ACTIONS.HUB_CONTINUE,
        namespace: NAMESPACE,
        payload: { selectedAction },
      });
    }
  };

  return (
    <section className="veripass-container-fluid veripass-w-100 veripass-p-0">
      <header className="veripass-mb-4 veripass-text-center">
        {ui.showTitle !== false && (
          <ViewTitle className="veripass-fw-bold veripass-mb-3">{ui.title || "Let's get started"}</ViewTitle>
        )}
        <ViewSubtitle className="veripass-m-0">
          {copy.hubSubtitle || 'Choose how you would like to set up your workspace.'}
        </ViewSubtitle>
      </header>

      <main className="veripass-mb-4">
        <VeripassSelectableCard
          title={copy.hubCreateTitle || 'Create organization'}
          description={copy.hubCreateSubtitle || 'Start a new workspace from scratch for your team.'}
          icon={<AddBusinessIcon />}
          selected={selectedAction === 'create-organization'}
          onClick={() => handleSelection('create-organization')}
          ui={ui}
        />

        <VeripassSelectableCard
          title={copy.hubChooseTitle || 'Choose your organization'}
          description={copy.hubChooseSubtitle || 'Sign in to an existing workspace via invitation.'}
          icon={<CorporateFareIcon />}
          selected={selectedAction === 'choose-organization'}
          onClick={() => handleSelection('choose-organization')}
          ui={ui}
        />
      </main>

      <footer className="veripass-d-flex veripass-mt-4">
        <VeripassActionButton
          customTheme={ui?.theme}
          variant="contained"
          fullWidth
          size="large"
          className="veripass-py-3 veripass-fw-bold veripass-fs-6"
          onClick={handleContinue}
          disabled={!selectedAction}
        >
          Continue
        </VeripassActionButton>
      </footer>
    </section>
  );
}

export const VeripassTenancyOnboardingHub = VeripassTenancyOnboardingHubComponent;
