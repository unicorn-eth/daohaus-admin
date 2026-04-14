import { createContext, useContext } from 'react';
import { useParams } from 'react-router-dom';

export type CurrentDaoContextType = {
  daoChain: string;
  daoId: string;
};

export const CurrentDaoContext = createContext<CurrentDaoContextType | null>(null);

export const useCurrentDao = (): CurrentDaoContextType => {
  const context = useContext(CurrentDaoContext);
  const { daochain, daoid } = useParams<{ daochain: string; daoid: string }>();

  if (context) {
    return context;
  }

  if (!daochain || !daoid) {
    throw new Error('useCurrentDao must be used within a DAO route');
  }

  return { daoChain: daochain, daoId: daoid };
};
