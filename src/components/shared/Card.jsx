import React from 'react';
import styled from 'styled-components';
import '@styles/fonts.css';
import '@styles/styles.css';

const StandardContainer = styled.section`
  margin: 0 auto;
  min-width: 400px;

  @media (min-width: 768px) {
    max-width: 66.6667%; /* 8/12 */
  }

  @media (min-width: 992px) {
    max-width: 50%; /* 6/12 */
  }

  @media (min-width: 1200px) {
    max-width: 41.6667%; /* 5/12 */
  }
`;

export const Card = ({ children, style = {} }) => {
  const defaultStyles = {
    border: '1px solid #f2f2f2',
    borderRadius: '8px',
    padding: '2.25rem',
    boxShadow: '0 .75rem 6rem rgba(56, 65, 74, 0.03)',
    background: '#FFFFFF',
  };
  return (
    <>
      <StandardContainer>
        <section style={{ ...defaultStyles, ...style }} className="veripass">
          {children}
        </section>
      </StandardContainer>
    </>
  );
};
