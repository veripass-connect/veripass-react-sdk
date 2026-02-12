import React from 'react';
import { Typography } from '@mui/material';
import '@styles/bootstrap-namespaced.css';

export const VeripassAuthLayout = ({ heroImage = { src: '', alt: 'Cover', title: '', subtitle: '' }, logo = null, children }) => {
  return (
    <div style={{ height: '70vh', width: '100%', overflowX: 'hidden', backgroundColor: '#fff' }}>
      <div className="veripass-container-fluid veripass-h-100 veripass-p-0">
        <div className="veripass-row veripass-h-100 veripass-g-0">
          <div
            className="veripass-col-lg-6 veripass-d-none veripass-d-lg-block veripass-position-relative veripass-h-100"
            style={{ backgroundColor: '#f0f0f0' }}
          >
            {heroImage?.src && (
              <>
                {logo && (
                  <div className="veripass-position-absolute veripass-top-0 veripass-start-0 veripass-p-4" style={{ zIndex: 10 }}>
                    {typeof logo === 'string' ? <img src={logo} alt="Logo" height="40" /> : logo}
                  </div>
                )}
                <img
                  src={heroImage.src}
                  alt={heroImage.alt || 'Cover'}
                  className="veripass-w-100 veripass-h-100"
                  style={{ objectFit: 'cover' }}
                />

                {(heroImage.title || heroImage.subtitle) && (
                  <div
                    className="veripass-position-absolute veripass-bottom-0 veripass-start-0 veripass-end-0 veripass-p-5"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)' }}
                  >
                    {heroImage.subtitle && (
                      <Typography
                        variant="subtitle2"
                        style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '8px', fontWeight: '300' }}
                      >
                        {heroImage.subtitle}
                      </Typography>
                    )}
                    {heroImage.title && (
                      <Typography variant="h4" component="h2" style={{ color: '#fff', fontWeight: 'bold' }}>
                        {heroImage.title}
                      </Typography>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Side - Form Container */}
          <div className="veripass-col-12 veripass-col-lg-6 veripass-d-flex veripass-align-items-center veripass-justify-content-center veripass-h-100 veripass-bg-white">
            <div className="veripass-w-100 veripass-p-4" style={{ maxWidth: '480px' }}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
