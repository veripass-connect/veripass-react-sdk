import React from 'react';
import { Typography } from '@mui/material';
import '@styles/bootstrap-namespaced.css';

export const VeripassAuthLayout = ({ sideImage = { src: '', alt: 'Cover', overlayText1: '', overlayText2: '' }, children }) => {
  return (
    <div className="veripass" style={{ height: '100vh', width: '100%', overflowX: 'hidden', backgroundColor: '#fff' }}>
      <div className="container-fluid h-100 p-0">
        <div className="row h-100 g-0">
          {/* Left Side - Image (Hidden on small screens) */}
          <div className="col-lg-6 d-none d-lg-block position-relative h-100" style={{ backgroundColor: '#f0f0f0' }}>
            {sideImage?.src && (
              <>
                <img src={sideImage.src} alt={sideImage.alt || 'Cover'} className="w-100 h-100" style={{ objectFit: 'cover' }} />

                {/* Overlay Text */}
                {(sideImage.overlayText1 || sideImage.overlayText2) && (
                  <div
                    className="position-absolute bottom-0 start-0 p-5 w-100"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)' }}
                  >
                    {sideImage.overlayText1 && (
                      <Typography variant="h3" component="h2" style={{ color: '#fff', fontWeight: 'bold', marginBottom: '8px' }}>
                        {sideImage.overlayText1}
                      </Typography>
                    )}
                    {sideImage.overlayText2 && (
                      <Typography variant="h6" style={{ color: 'rgba(255,255,255,0.9)' }}>
                        {sideImage.overlayText2}
                      </Typography>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Side - Form Container */}
          <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center h-100 bg-white">
            <div className="w-100 p-4" style={{ maxWidth: '480px' }}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
