import { RecoilState, RecoilValue, useRecoilCallback } from 'recoil';

import { Setter } from 'core/block';

interface RecoilHelpers {
  get?: <T>(atom: RecoilValue<T>) => T;
  set?: Setter;
}

const recoil: RecoilHelpers = {};

// Helper component used to export recoil to outside react root
function RecoilExporter() {
  recoil.get = useRecoilCallback<[atom: RecoilValue<any>], any>(
    ({ snapshot }) =>
      function <T>(atom: RecoilValue<T>) {
        return snapshot.getLoadable(atom).contents;
      },
    []
  );

  recoil.set = useRecoilCallback(
    ({ set }) =>
      function (recoilVal: RecoilState<any>, valOrUpdater: any) {
        set(recoilVal, valOrUpdater);
      },
    []
  );

  return <></>;
}

function getValue<T>(atom: RecoilValue<T>): T {
  if (!recoil.get) {
    throw new Error('Recoil Exporter not initialized');
  }
  return recoil.get(atom);
}

function setValue<T>(state: RecoilState<T>, valOrUpdater: any) {
  if (!recoil.set) {
    throw new Error('Recoil Exporter not initialized');
  }

  return recoil.set(state, valOrUpdater);
}

export default RecoilExporter;
export { getValue, setValue };
