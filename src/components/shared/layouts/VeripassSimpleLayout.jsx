import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Typography } from '@mui/material';

import '@styles/bootstrap-namespaced.css';
import '@styles/styles.css';
import '@styles/fonts.css';

export const VeripassSimpleLayout = ({ children, ...props }) => {
  return (
    <section className={`veripass`} style={{ boxSizing: 'border-box' }}>
      <main {...props}>{children}</main>
    </section>
  );
};
