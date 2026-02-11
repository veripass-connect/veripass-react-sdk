import React from 'react';
import { Typography } from '@mui/material';
import '@styles/bootstrap-namespaced.css';

export const VeripassAuthLayout = ({
  sideImage = { src: '', alt: 'Cover', overlayText1: '', overlayText2: '' },
  logo = null,
  children,
}) => {
  return (
    <div style={{ height: '100vh', width: '100%', overflowX: 'hidden', backgroundColor: '#fff' }}>
      <div className="veripass-container-fluid veripass-h-100 veripass-p-0">
        <div className="veripass-row veripass-h-100 veripass-g-0">
          <div
            className="veripass-col-lg-6 veripass-d-none veripass-d-lg-block veripass-position-relative veripass-h-100"
            style={{ backgroundColor: '#f0f0f0' }}
          >
            {sideImage?.src && (
              <>
                {logo && (
                  <div className="veripass-position-absolute veripass-top-0 veripass-start-0 veripass-p-4" style={{ zIndex: 10 }}>
                    {typeof logo === 'string' ? <img src={logo} alt="Logo" height="40" /> : logo}
                  </div>
                )}
                <img
                  src={sideImage.src}
                  alt={sideImage.alt || 'Cover'}
                  className="veripass-w-100 veripass-h-100"
                  style={{ objectFit: 'cover' }}
                />

                {(sideImage.overlayText1 || sideImage.overlayText2) && (
                  <div
                    className="veripass-position-absolute veripass-bottom-0 veripass-start-0 veripass-end-0 veripass-p-5"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)' }}
                  >
                    {sideImage.overlayText2 && (
                      <Typography
                        variant="subtitle1"
                        style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '8px', fontWeight: '500' }}
                      >
                        {sideImage.overlayText2}
                      </Typography>
                    )}
                    {sideImage.overlayText1 && (
                      <Typography variant="h3" component="h2" style={{ color: '#fff', fontWeight: 'bold' }}>
                        {sideImage.overlayText1}
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
