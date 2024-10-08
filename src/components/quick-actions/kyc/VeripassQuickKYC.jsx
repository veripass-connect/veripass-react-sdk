import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const VeripassQuickKyc = ({ entity, onUpdatedEntity, setIsOpen, isPopupContext }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, [entity]);

  return (
   <></>
  );
};

export default VeripassQuickKyc;
