import { LifeCycleNames, TXLifeCycleFns } from '../TXBuilder';

export const bundleLifeCycleFns = ({
  appEffects,
  componentEffects,
}: {
  appEffects: TXLifeCycleFns;
  componentEffects: TXLifeCycleFns;
}): TXLifeCycleFns => {
  const allCycles: LifeCycleNames[] = [
    'onRequestSign',
    'onTxHash',
    'onTxError',
    'onTxSuccess',
    'onPollStart',
    'onPollError',
    'onPollSuccess',
  ];

  return allCycles.reduce((acc, cycle) => {
    if (appEffects[cycle] && componentEffects[cycle]) {
      return {
        ...acc,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [cycle]: (...args: any[]) => {
          // @ts-expect-error: bundled lifecycle fns have heterogeneous signatures
          appEffects[cycle]?.(...args);
          // @ts-expect-error: bundled lifecycle fns have heterogeneous signatures
          componentEffects[cycle]?.(...args);
        },
      };
    }
    if (appEffects[cycle]) return { ...acc, [cycle]: appEffects[cycle] };
    if (componentEffects[cycle]) return { ...acc, [cycle]: componentEffects[cycle] };
    return acc;
  }, {});
};
