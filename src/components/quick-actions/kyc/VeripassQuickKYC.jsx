import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const VeripassQuickKyc = ({ entity, onUpdatedEntity, setIsOpen, isPopupContext, extraFields }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, [entity]);

  return (
   <>
   {/* TODO:
      - Foto de documento nacional o pasaporte
        - Numero de documento nacional
        - Nombres y apellidos
        - Nacionalidad
        - Fecha de nacimiento (Identificar que es menor de edad)
      - Direccion de residencia
      - Pais de residencia
      - Telefono de contacto
      - Datos adicionales
    */}
   </>
  );
};
